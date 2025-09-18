const axios = require('axios');
const TextExtractionService = require('./textExtractionService');

class ExternalParserService {
  constructor() {
    this.affindaApiKey = process.env.AFFINDA_API_KEY;
    this.rchilliApiKey = process.env.RCHILLI_API_KEY;
    this.preferredProvider = process.env.RESUME_PARSER_PROVIDER || 'local'; // 'affinda', 'rchilli', or 'local'
    this.textExtractor = new TextExtractionService();
  }

  async parseResume(buffer, mimetype, filename) {
    try {
      // First try to extract text using our robust text extraction service
      let extractedText = '';
      let extractionMetadata = {};
      
      if (buffer) {
        try {
          const textResult = await this.textExtractor.extractText(buffer, mimetype, filename);
          extractedText = textResult.text;
          extractionMetadata = textResult.metadata;
          console.log(`Successfully extracted text using ${extractionMetadata.extractionMethod}`);
        } catch (textError) {
          console.error('Text extraction failed:', textError.message);
          extractedText = 'Failed to extract text from file';
        }
      }

      // Try external parsers first if configured
      if (this.preferredProvider === 'affinda' && this.affindaApiKey && this.affindaApiKey !== 'your_affinda_api_key_here') {
        try {
          const result = await this.parseWithAffinda(buffer, mimetype, filename);
          // Enhance with extracted text if available
          if (extractedText && !result.summary) {
            result.summary = extractedText.substring(0, 500);
          }
          result.extractionMetadata = extractionMetadata;
          return result;
        } catch (error) {
          console.error('Affinda parsing failed, falling back:', error.message);
        }
      } else if (this.preferredProvider === 'rchilli' && this.rchilliApiKey && this.rchilliApiKey !== 'your_rchilli_api_key_here') {
        try {
          const result = await this.parseWithRChilli(buffer, mimetype, filename);
          // Enhance with extracted text if available
          if (extractedText && !result.summary) {
            result.summary = extractedText.substring(0, 500);
          }
          result.extractionMetadata = extractionMetadata;
          return result;
        } catch (error) {
          console.error('RChilli parsing failed, falling back:', error.message);
        }
      }

      // Use local parsing with enhanced text extraction
      return await this.parseLocally(buffer, mimetype, extractedText, extractionMetadata);
    } catch (error) {
      console.error('Resume parsing error:', error.message);
      // Return basic structure even on complete failure
      return {
        personalInfo: {
          name: 'Unknown',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          portfolio: ''
        },
        summary: 'Failed to parse resume',
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        projects: [],
        extractionMethod: 'error-fallback'
      };
    }
  }

  async parseWithAffinda(buffer, mimetype, filename) {
    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimetype });
    formData.append('file', blob, filename);

    const response = await axios.post('https://api.affinda.com/v3/documents', formData, {
      headers: {
        'Authorization': `Bearer ${this.affindaApiKey}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const data = response.data.data;
    
    return {
      personalInfo: {
        name: data.name?.raw || '',
        email: data.emails?.[0]?.value || '',
        phone: data.phoneNumbers?.[0]?.value || '',
        location: data.location?.formatted || '',
        linkedin: data.websites?.find(w => w.url?.includes('linkedin'))?.url || '',
        portfolio: data.websites?.find(w => !w.url?.includes('linkedin'))?.url || ''
      },
      summary: data.summary || '',
      skills: (data.skills || []).map(skill => ({
        name: skill.name,
        level: 70, // Default level
        category: 'Technical',
        yearsOfExperience: 0
      })),
      experience: (data.workExperience || []).map(exp => ({
        company: exp.organization || '',
        position: exp.jobTitle || '',
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        description: exp.jobDescription || '',
        skills: [],
        achievements: []
      })),
      education: (data.education || []).map(edu => ({
        institution: edu.organization || '',
        degree: edu.accreditation?.education || '',
        field: edu.accreditation?.educationLevel || '',
        startDate: edu.startDate ? new Date(edu.startDate) : null,
        endDate: edu.endDate ? new Date(edu.endDate) : null,
        gpa: edu.grade || '',
        honors: []
      })),
      certifications: [],
      projects: [],
      extractionMethod: 'affinda'
    };
  }

  async parseWithRChilli(buffer, mimetype, filename) {
    const base64 = buffer.toString('base64');
    
    const payload = {
      filedata: base64,
      filename: filename,
      userkey: this.rchilliApiKey,
      version: "9.0.0",
      subuserid: "1"
    };

    const response = await axios.post('https://rest.rchilli.com/RChilliParser/Rchilli/parseResumeBinary', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data.ResumeParserData;
    
    return {
      personalInfo: {
        name: data.Name || '',
        email: data.Email || '',
        phone: data.Phone || '',
        location: data.Address || '',
        linkedin: data.WebSite?.find(w => w.includes('linkedin')) || '',
        portfolio: data.WebSite?.find(w => !w.includes('linkedin')) || ''
      },
      summary: data.Summary || '',
      skills: (data.SkillKeywords || []).map(skill => ({
        name: skill,
        level: 70,
        category: 'Technical',
        yearsOfExperience: 0
      })),
      experience: (data.WorkedPeriod || []).map(exp => ({
        company: exp.CompanyName || '',
        position: exp.JobProfile || '',
        startDate: exp.StartDate ? new Date(exp.StartDate) : null,
        endDate: exp.EndDate ? new Date(exp.EndDate) : null,
        description: exp.JobDescription || '',
        skills: [],
        achievements: []
      })),
      education: (data.EducationSplit || []).map(edu => ({
        institution: edu.Institution || '',
        degree: edu.Degree || '',
        field: edu.Specialization || '',
        startDate: null,
        endDate: null,
        gpa: '',
        honors: []
      })),
      certifications: [],
      projects: [],
      extractionMethod: 'rchilli'
    };
  }

  async parseLocally(buffer, mimetype, extractedText = '', extractionMetadata = {}) {
    try {
      let text = extractedText;
      
      // If no extracted text provided, try basic extraction
      if (!text && buffer) {
        if (mimetype && mimetype.startsWith('text/')) {
          text = buffer.toString('utf8');
        } else {
          text = 'Unable to extract text from binary file';
        }
      }

      // Extract personal information using our enhanced extractor
      const personalInfo = this.textExtractor.extractPersonalInfo(text);
      
      // Extract skills using our enhanced skill extraction
      const skills = this.textExtractor.extractSkills(text);

      // Extract sections from text
      const sections = this.extractSections(text);

      return {
        personalInfo: {
          name: personalInfo.name || 'Candidate',
          email: personalInfo.email || '',
          phone: personalInfo.phone || '',
          location: personalInfo.location || '',
          linkedin: personalInfo.linkedin || '',
          github: personalInfo.github || '',
          portfolio: personalInfo.portfolio || ''
        },
        summary: sections.summary || text.substring(0, 500),
        skills: skills,
        experience: sections.experience || [],
        education: sections.education || [],
        certifications: sections.certifications || [],
        projects: sections.projects || [],
        extractionMethod: 'enhanced-local',
        extractionMetadata: extractionMetadata,
        rawText: text
      };
    } catch (error) {
      console.error('Local parsing error:', error);
      return {
        personalInfo: { name: 'Candidate', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
        summary: 'Failed to parse resume locally',
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        projects: [],
        extractionMethod: 'basic-fallback'
      };
    }
  }

  // Helper method for backward compatibility
  extractSkills(text) {
    return this.textExtractor.extractSkills(text);
  }

  extractSections(text) {
    const sections = {
      summary: '',
      experience: [],
      education: [],
      certifications: [],
      projects: []
    };

    try {
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      let currentSection = '';
      let currentContent = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        
        // Identify section headers
        if (this.isSummaryHeader(line)) {
          if (currentSection && currentContent.length) {
            this.processSection(currentSection, currentContent, sections);
          }
          currentSection = 'summary';
          currentContent = [];
        } else if (this.isExperienceHeader(line)) {
          if (currentSection && currentContent.length) {
            this.processSection(currentSection, currentContent, sections);
          }
          currentSection = 'experience';
          currentContent = [];
        } else if (this.isEducationHeader(line)) {
          if (currentSection && currentContent.length) {
            this.processSection(currentSection, currentContent, sections);
          }
          currentSection = 'education';
          currentContent = [];
        } else if (this.isCertificationHeader(line)) {
          if (currentSection && currentContent.length) {
            this.processSection(currentSection, currentContent, sections);
          }
          currentSection = 'certifications';
          currentContent = [];
        } else if (this.isProjectsHeader(line)) {
          if (currentSection && currentContent.length) {
            this.processSection(currentSection, currentContent, sections);
          }
          currentSection = 'projects';
          currentContent = [];
        } else if (currentSection) {
          currentContent.push(lines[i]); // Use original case
        } else if (!currentSection && i < 10) {
          // Treat first few lines as potential summary if no section identified yet
          if (!sections.summary) sections.summary = lines[i];
        }
      }

      // Process the last section
      if (currentSection && currentContent.length) {
        this.processSection(currentSection, currentContent, sections);
      }

      return sections;
    } catch (error) {
      console.error('Section extraction error:', error);
      return sections;
    }
  }

  isSummaryHeader(line) {
    const summaryKeywords = ['summary', 'profile', 'about', 'overview', 'objective', 'professional summary'];
    return summaryKeywords.some(keyword => line.includes(keyword));
  }

  isExperienceHeader(line) {
    const expKeywords = ['experience', 'work experience', 'employment', 'work history', 'professional experience'];
    return expKeywords.some(keyword => line.includes(keyword));
  }

  isEducationHeader(line) {
    const eduKeywords = ['education', 'academic', 'qualifications', 'academic background'];
    return eduKeywords.some(keyword => line.includes(keyword));
  }

  isCertificationHeader(line) {
    const certKeywords = ['certifications', 'certificates', 'credentials', 'licenses'];
    return certKeywords.some(keyword => line.includes(keyword));
  }

  isProjectsHeader(line) {
    const projectKeywords = ['projects', 'portfolio', 'personal projects', 'key projects'];
    return projectKeywords.some(keyword => line.includes(keyword));
  }

  processSection(sectionType, content, sections) {
    const text = content.join(' ');
    
    switch (sectionType) {
      case 'summary':
        sections.summary = text;
        break;
      case 'experience':
        sections.experience = this.parseExperience(content);
        break;
      case 'education':
        sections.education = this.parseEducation(content);
        break;
      case 'certifications':
        sections.certifications = this.parseCertifications(content);
        break;
      case 'projects':
        sections.projects = this.parseProjects(content);
        break;
    }
  }

  parseExperience(lines) {
    // Basic experience parsing - can be enhanced
    const experiences = [];
    let currentExp = null;

    for (const line of lines) {
      // Look for job titles and companies (simple heuristics)
      if (line.includes(' at ') || line.includes(' - ')) {
        if (currentExp) {
          experiences.push(currentExp);
        }
        const parts = line.split(/\s+at\s+|\s+-\s+/);
        currentExp = {
          position: parts[0] || '',
          company: parts[1] || '',
          startDate: null,
          endDate: null,
          description: '',
          achievements: []
        };
      } else if (currentExp) {
        if (currentExp.description) {
          currentExp.description += ' ' + line;
        } else {
          currentExp.description = line;
        }
      }
    }

    if (currentExp) {
      experiences.push(currentExp);
    }

    return experiences;
  }

  parseEducation(lines) {
    // Basic education parsing
    const education = [];
    let currentEdu = null;

    for (const line of lines) {
      if (line.includes('university') || line.includes('college') || line.includes('institute')) {
        if (currentEdu) {
          education.push(currentEdu);
        }
        currentEdu = {
          institution: line,
          degree: '',
          field: '',
          startDate: null,
          endDate: null,
          gpa: '',
          honors: []
        };
      } else if (currentEdu && (line.includes('bachelor') || line.includes('master') || line.includes('phd') || line.includes('degree'))) {
        currentEdu.degree = line;
      }
    }

    if (currentEdu) {
      education.push(currentEdu);
    }

    return education;
  }

  parseCertifications(lines) {
    return lines.map(line => ({
      name: line,
      issuer: '',
      date: null,
      expiryDate: null,
      credentialId: ''
    }));
  }

  parseProjects(lines) {
    return lines.map(line => ({
      name: line,
      description: '',
      technologies: [],
      url: '',
      startDate: null,
      endDate: null
    }));
  }
}

module.exports = ExternalParserService;