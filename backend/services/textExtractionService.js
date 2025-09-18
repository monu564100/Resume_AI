const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

class TextExtractionService {
  constructor() {
    this.supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/rtf'
    ];
  }

  async extractText(buffer, mimetype, filename = '') {
    try {
      console.log(`Extracting text from ${mimetype || 'unknown'} file: ${filename}`);
      
      // Determine file type
      const fileType = this.determineFileType(buffer, mimetype, filename);
      
      switch (fileType) {
        case 'pdf':
          return await this.extractFromPDF(buffer);
        case 'docx':
          return await this.extractFromDOCX(buffer);
        case 'doc':
          return await this.extractFromDOC(buffer);
        case 'txt':
          return await this.extractFromText(buffer);
        case 'rtf':
          return await this.extractFromRTF(buffer);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  determineFileType(buffer, mimetype, filename) {
    // Check by MIME type first
    if (mimetype) {
      if (mimetype === 'application/pdf') return 'pdf';
      if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
      if (mimetype === 'application/msword') return 'doc';
      if (mimetype === 'text/plain') return 'txt';
      if (mimetype === 'text/rtf' || mimetype === 'application/rtf') return 'rtf';
    }

    // Check by file extension
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.pdf') return 'pdf';
    if (ext === '.docx') return 'docx';
    if (ext === '.doc') return 'doc';
    if (ext === '.txt') return 'txt';
    if (ext === '.rtf') return 'rtf';

    // Check by file signature (magic numbers)
    if (buffer.length >= 4) {
      const signature = buffer.subarray(0, 4);
      
      // PDF signature: %PDF
      if (signature[0] === 0x25 && signature[1] === 0x50 && signature[2] === 0x44 && signature[3] === 0x46) {
        return 'pdf';
      }
      
      // ZIP-based formats (DOCX) signature: PK
      if (signature[0] === 0x50 && signature[1] === 0x4B) {
        return 'docx';
      }
      
      // DOC signature
      if (signature[0] === 0xD0 && signature[1] === 0xCF && signature[2] === 0x11 && signature[3] === 0xE0) {
        return 'doc';
      }
    }

    // Default to text
    return 'txt';
  }

  async extractFromPDF(buffer) {
    try {
      const data = await pdf(buffer);
      return {
        text: data.text,
        metadata: {
          pages: data.numpages,
          info: data.info,
          extractionMethod: 'pdf-parse'
        }
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async extractFromDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return {
        text: result.value,
        metadata: {
          extractionMethod: 'mammoth',
          warnings: result.messages
        }
      };
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX');
    }
  }

  async extractFromDOC(buffer) {
    try {
      // For older DOC files, we'll try a basic conversion
      // This is a simplified approach - in production, you might want to use
      // a more robust library or convert to DOCX first
      const text = buffer.toString('utf8').replace(/[^\x20-\x7E]/g, ' ');
      return {
        text: this.cleanText(text),
        metadata: {
          extractionMethod: 'basic-doc-conversion',
          note: 'Limited DOC support - consider converting to DOCX for better results'
        }
      };
    } catch (error) {
      console.error('DOC extraction error:', error);
      throw new Error('Failed to extract text from DOC');
    }
  }

  async extractFromText(buffer) {
    try {
      const text = buffer.toString('utf8');
      return {
        text: text,
        metadata: {
          extractionMethod: 'direct-text'
        }
      };
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Failed to extract text from text file');
    }
  }

  async extractFromRTF(buffer) {
    try {
      // Basic RTF parsing - remove RTF formatting codes
      const rtfText = buffer.toString('utf8');
      const text = rtfText
        .replace(/\\[a-z]{1,32}(-?\d{1,10})?[ ]?|\\'[0-9a-f]{2}|\\[^a-z]|[{}]|\r\n?|\n/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return {
        text: text,
        metadata: {
          extractionMethod: 'basic-rtf-parsing'
        }
      };
    } catch (error) {
      console.error('RTF extraction error:', error);
      throw new Error('Failed to extract text from RTF');
    }
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
  }

  // Extract specific information from text
  extractPersonalInfo(text) {
    const info = {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      linkedin: this.extractLinkedIn(text),
      github: this.extractGitHub(text),
      portfolio: this.extractPortfolio(text),
      location: this.extractLocation(text)
    };

    return info;
  }

  extractName(text) {
    // Look for name patterns at the beginning of the resume
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // First non-empty line is often the name
    if (lines.length > 0) {
      const firstLine = lines[0];
      // Check if it looks like a name (not email, phone, etc.)
      if (!this.isEmail(firstLine) && !this.isPhone(firstLine) && !this.isUrl(firstLine)) {
        return firstLine;
      }
    }

    // Look for common name patterns
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+)/,
      /^([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)/,
      /^([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)/
    ];

    for (const line of lines.slice(0, 5)) {
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match) {
          return match[1];
        }
      }
    }

    return null;
  }

  extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }

  extractPhone(text) {
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      /(\+?\d{1,3}[-.\s]?)?\d{10}/,
      /(\+?\d{1,3}[-.\s]?)?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return null;
  }

  extractLinkedIn(text) {
    const linkedinRegex = /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/;
    const match = text.match(linkedinRegex);
    return match ? match[0] : null;
  }

  extractGitHub(text) {
    const githubRegex = /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+/;
    const match = text.match(githubRegex);
    return match ? match[0] : null;
  }

  extractPortfolio(text) {
    const urlRegex = /https?:\/\/[^\s]+\.(com|net|org|io|dev|me)/gi;
    const matches = text.match(urlRegex) || [];
    
    // Filter out LinkedIn, GitHub, and common sites
    const portfolioUrls = matches.filter(url => 
      !url.includes('linkedin.com') && 
      !url.includes('github.com') &&
      !url.includes('facebook.com') &&
      !url.includes('twitter.com') &&
      !url.includes('instagram.com')
    );
    
    return portfolioUrls.length > 0 ? portfolioUrls[0] : null;
  }

  extractLocation(text) {
    // Look for common location patterns
    const locationPatterns = [
      /([A-Z][a-z]+,\s*[A-Z]{2})/,  // City, State
      /([A-Z][a-z]+,\s*[A-Z][a-z]+)/,  // City, Country
      /([A-Z][a-z]+\s*[A-Z][a-z]*,\s*[A-Z]{2}\s*\d{5})/  // City State ZIP
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  // Helper methods
  isEmail(str) {
    return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(str);
  }

  isPhone(str) {
    return /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(str);
  }

  isUrl(str) {
    return /https?:\/\//.test(str);
  }

  // Extract skills from text
  extractSkills(text) {
    const techSkills = [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'C#', 'C++', 'C', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
      'TypeScript', 'Scala', 'R', 'MATLAB', 'Perl', 'Bash', 'PowerShell',
      
      // Web Technologies
      'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Svelte', 'jQuery', 'Bootstrap', 'Tailwind CSS',
      'SASS', 'LESS', 'Material-UI', 'Chakra UI', 'Next.js', 'Nuxt.js', 'Gatsby',
      
      // Backend & Frameworks
      'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'Laravel',
      'Ruby on Rails', 'ASP.NET', 'Gin', 'Echo', 'Fiber',
      
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'MariaDB',
      'Cassandra', 'DynamoDB', 'Elasticsearch', 'Neo4j',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
      'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant', 'CircleCI', 'Travis CI',
      
      // Data & Analytics
      'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Apache Spark',
      'Hadoop', 'Tableau', 'Power BI', 'D3.js', 'Chart.js',
      
      // Mobile Development
      'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Android', 'iOS', 'Swift UI',
      
      // Tools & Others
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Confluence', 'Slack', 'Trello',
      'Postman', 'Insomnia', 'Figma', 'Adobe XD', 'Sketch', 'InVision'
    ];

    const foundSkills = [];
    const textLower = text.toLowerCase();

    techSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (textLower.includes(skillLower)) {
        // Try to determine skill level based on context
        const level = this.estimateSkillLevel(text, skill);
        foundSkills.push({
          name: skill,
          level: level,
          category: this.categorizeSkill(skill),
          yearsOfExperience: 0 // Could be enhanced to extract years
        });
      }
    });

    return foundSkills;
  }

  estimateSkillLevel(text, skill) {
    const skillLower = skill.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Look for experience indicators
    const expertPatterns = ['expert', 'advanced', 'senior', 'lead', 'architect'];
    const intermediatePatterns = ['intermediate', 'proficient', 'experienced'];
    const beginnerPatterns = ['beginner', 'basic', 'learning', 'familiar'];
    
    const skillIndex = textLower.indexOf(skillLower);
    if (skillIndex === -1) return 50; // Default
    
    // Look in the surrounding text (50 chars before and after)
    const contextStart = Math.max(0, skillIndex - 50);
    const contextEnd = Math.min(textLower.length, skillIndex + skillLower.length + 50);
    const context = textLower.substring(contextStart, contextEnd);
    
    if (expertPatterns.some(pattern => context.includes(pattern))) return 90;
    if (intermediatePatterns.some(pattern => context.includes(pattern))) return 70;
    if (beginnerPatterns.some(pattern => context.includes(pattern))) return 40;
    
    return 60; // Default intermediate level
  }

  categorizeSkill(skill) {
    const categories = {
      'Programming Languages': ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'C', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Scala', 'R'],
      'Frontend': ['HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Svelte', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'SASS', 'LESS'],
      'Backend': ['Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET'],
      'Databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'MariaDB', 'Cassandra'],
      'Cloud & DevOps': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform'],
      'Data Science': ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Apache Spark', 'Tableau', 'Power BI'],
      'Mobile': ['React Native', 'Flutter', 'Xamarin', 'Ionic', 'Android', 'iOS', 'Swift UI'],
      'Tools': ['Git', 'GitHub', 'GitLab', 'JIRA', 'Confluence', 'Postman', 'Figma', 'Adobe XD']
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.includes(skill)) {
        return category;
      }
    }
    
    return 'Other';
  }
}

module.exports = TextExtractionService;