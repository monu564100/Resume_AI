const axios = require('axios');

class IndiaJobsService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.naukri_api_key = process.env.NAUKRI_API_KEY;
    this.linkedInApiKey = process.env.LINKEDIN_API_KEY;
    
    // Popular Indian job boards and their endpoints
    this.jobSources = {
      naukri: 'https://api.naukri.com',
      shine: 'https://api.shine.com',
      timesjobs: 'https://api.timesjobs.com',
      monster: 'https://api.monsterindia.com',
      linkedin: 'https://linkedin-jobs-search.p.rapidapi.com'
    };

    // Indian cities and their common tech hubs
    this.indianCities = [
      'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
      'Gurgaon', 'Noida', 'Ahmedabad', 'Jaipur', 'Kochi', 'Indore', 'Chandigarh',
      'Thiruvananthapuram', 'Bhubaneswar', 'Coimbatore', 'Mysore', 'Vadodara'
    ];

    // Common Indian company types and names
    this.indianCompanies = {
      'IT Services': ['TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra', 'Cognizant', 'Capgemini'],
      'Product Companies': ['Flipkart', 'Ola', 'Paytm', 'Zomato', 'Swiggy', 'BYJU\'S', 'Freshworks'],
      'Startups': ['Razorpay', 'Dunzo', 'Udaan', 'Meesho', 'PhonePe', 'Dream11', 'Unacademy'],
      'Global MNCs': ['Microsoft India', 'Google India', 'Amazon India', 'Apple India', 'Oracle India', 'SAP Labs India'],
      'Banks & Fintech': ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'PayU', 'PolicyBazaar']
    };

    // Skills mapping for Indian market
    this.indianMarketSkills = {
      'Software Developer': ['Java', 'Python', 'JavaScript', 'React', 'Spring Boot', 'MySQL', 'AWS'],
      'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'Express.js', 'HTML/CSS', 'JavaScript', 'Git'],
      'Backend Developer': ['Java', 'Spring', 'Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
      'Frontend Developer': ['React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
      'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'Python'],
      'Data Scientist': ['Python', 'R', 'Machine Learning', 'Pandas', 'NumPy', 'TensorFlow', 'SQL'],
      'Product Manager': ['Agile', 'JIRA', 'Analytics', 'Product Strategy', 'A/B Testing', 'SQL'],
      'QA Engineer': ['Selenium', 'Java', 'TestNG', 'Automation Testing', 'Manual Testing', 'JIRA'],
      'Mobile Developer': ['React Native', 'Flutter', 'Android', 'iOS', 'Kotlin', 'Swift'],
      'UI/UX Designer': ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'User Research', 'Prototyping']
    };
  }

  async findMatchingJobs(candidateSkills, preferredLocation = 'Bangalore', experienceLevel = 'mid', limit = 15) {
    try {
      console.log(`Finding jobs in India for skills: ${candidateSkills.join(', ')}`);
      
      // Generate mock Indian jobs based on skills
      const mockJobs = this.generateIndianJobs(candidateSkills, preferredLocation, experienceLevel, limit);
      
      // If we have API keys, try to get real jobs and merge with mock data
      let realJobs = [];
      
      if (this.rapidApiKey && this.rapidApiKey !== 'your_rapidapi_key_here') {
        realJobs = await this.searchLinkedInJobsIndia(candidateSkills, preferredLocation, Math.min(limit, 5));
      }
      
      // Combine and deduplicate
      const allJobs = [...realJobs, ...mockJobs];
      const uniqueJobs = this.deduplicateJobs(allJobs);
      
      return uniqueJobs.slice(0, limit);
    } catch (error) {
      console.error('Indian job search error:', error.message);
      return this.generateIndianJobs(candidateSkills, preferredLocation, experienceLevel, limit);
    }
  }

  async searchLinkedInJobsIndia(skills, location, limit = 5) {
    try {
      const skillQuery = skills.slice(0, 3).join(' OR ');
      const indianLocation = `${location}, India`;
      
      const response = await axios.get('https://linkedin-jobs-search.p.rapidapi.com/search', {
        params: {
          keywords: skillQuery,
          location: indianLocation,
          limit: limit,
          sort: 'recent'
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
        },
        timeout: 10000
      });

      return this.normalizeLinkedInJobs(response.data.jobs || [], skills);
    } catch (error) {
      console.error('LinkedIn India job search failed:', error.message);
      return [];
    }
  }

  generateIndianJobs(candidateSkills, preferredLocation, experienceLevel, limit) {
    const jobs = [];
    const skillsSet = new Set(candidateSkills.map(s => s.toLowerCase()));
    
    // Find matching job roles based on skills
    const matchingRoles = this.findMatchingRoles(candidateSkills);
    
    for (let i = 0; i < limit; i++) {
      const role = matchingRoles[i % matchingRoles.length];
      const company = this.getRandomCompany();
      const location = this.getRandomLocation(preferredLocation);
      const salary = this.generateSalaryRange(role.title, experienceLevel);
      
      const job = {
        title: role.title,
        company: company,
        location: location,
        salary: salary,
        matchScore: role.matchScore,
        keySkillMatches: role.matchingSkills,
        missingSkills: role.missingSkills,
        description: this.generateJobDescription(role.title, role.requiredSkills),
        url: `https://naukri.com/job/${role.title.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
        postedDate: this.getRecentDate(),
        source: 'indian-job-board',
        experienceRequired: this.getExperienceRange(experienceLevel),
        benefits: this.getCommonBenefits(),
        companySize: this.getCompanySize(company),
        workMode: this.getWorkMode(),
        industry: this.getIndustryForCompany(company)
      };
      
      jobs.push(job);
    }
    
    return jobs.sort((a, b) => b.matchScore - a.matchScore);
  }

  findMatchingRoles(candidateSkills) {
    const roles = [];
    const skillsLower = candidateSkills.map(s => s.toLowerCase());
    
    for (const [roleTitle, requiredSkills] of Object.entries(this.indianMarketSkills)) {
      const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());
      const matchingSkills = skillsLower.filter(skill => 
        requiredSkillsLower.some(reqSkill => reqSkill.includes(skill) || skill.includes(reqSkill))
      );
      const missingSkills = requiredSkills.filter(reqSkill => 
        !skillsLower.some(skill => skill.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      
      const matchScore = requiredSkills.length > 0 
        ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
        : 0;
      
      if (matchScore > 20) { // Only include roles with reasonable match
        roles.push({
          title: roleTitle,
          matchScore: Math.min(matchScore, 95), // Cap at 95% to be realistic
          matchingSkills: matchingSkills,
          missingSkills: missingSkills.slice(0, 3), // Limit missing skills
          requiredSkills: requiredSkills
        });
      }
    }
    
    // If no good matches, add some generic developer roles
    if (roles.length === 0) {
      roles.push({
        title: 'Software Developer',
        matchScore: 60,
        matchingSkills: candidateSkills.slice(0, 3),
        missingSkills: ['Java', 'Spring Boot', 'MySQL'],
        requiredSkills: ['Java', 'Spring Boot', 'MySQL']
      });
    }
    
    return roles.sort((a, b) => b.matchScore - a.matchScore);
  }

  getRandomCompany() {
    const categories = Object.keys(this.indianCompanies);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const companies = this.indianCompanies[randomCategory];
    return companies[Math.floor(Math.random() * companies.length)];
  }

  getRandomLocation(preferred = 'Bangalore') {
    // 60% chance of preferred location, 40% chance of other tech hubs
    if (Math.random() < 0.6) {
      return preferred;
    }
    
    const techHubs = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
    return techHubs[Math.floor(Math.random() * techHubs.length)];
  }

  generateSalaryRange(role, experienceLevel) {
    const baseSalaries = {
      'entry': { min: 300000, max: 800000 },    // 3-8 LPA
      'mid': { min: 800000, max: 2000000 },     // 8-20 LPA
      'senior': { min: 2000000, max: 5000000 }  // 20-50 LPA
    };
    
    const base = baseSalaries[experienceLevel] || baseSalaries['mid'];
    
    // Adjust based on role
    const roleMultipliers = {
      'Software Developer': 1.0,
      'Full Stack Developer': 1.1,
      'Backend Developer': 1.0,
      'Frontend Developer': 0.9,
      'DevOps Engineer': 1.3,
      'Data Scientist': 1.4,
      'Product Manager': 1.5,
      'QA Engineer': 0.8,
      'Mobile Developer': 1.1,
      'UI/UX Designer': 0.9
    };
    
    const multiplier = roleMultipliers[role] || 1.0;
    const min = Math.round(base.min * multiplier);
    const max = Math.round(base.max * multiplier);
    
    return `₹${this.formatIndianCurrency(min)} - ₹${this.formatIndianCurrency(max)} LPA`;
  }

  formatIndianCurrency(amount) {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  }

  generateJobDescription(title, skills) {
    const descriptions = {
      'Software Developer': `We are seeking a skilled Software Developer to join our dynamic team. You will be responsible for developing high-quality applications and working closely with cross-functional teams to deliver innovative solutions.`,
      'Full Stack Developer': `Looking for a Full Stack Developer to work on both frontend and backend technologies. You will be involved in the complete development lifecycle from design to deployment.`,
      'Backend Developer': `Join our backend team to build scalable and robust server-side applications. You will work with databases, APIs, and server infrastructure to ensure optimal performance.`,
      'DevOps Engineer': `We need a DevOps Engineer to streamline our development and deployment processes. You will work with cloud infrastructure, CI/CD pipelines, and automation tools.`,
      'Data Scientist': `Seeking a Data Scientist to analyze complex datasets and derive actionable insights. You will work with machine learning models and statistical analysis to drive business decisions.`
    };
    
    const baseDescription = descriptions[title] || descriptions['Software Developer'];
    const skillsList = skills.join(', ');
    
    return `${baseDescription}\n\nRequired Skills: ${skillsList}\n\nLocation: Hybrid/On-site\nExperience: 2-5 years\n\nWhat we offer:\n• Competitive salary and benefits\n• Flexible working hours\n• Learning and development opportunities\n• Health insurance and wellness programs`;
  }

  getExperienceRange(level) {
    const ranges = {
      'entry': '0-2 years',
      'mid': '2-5 years',
      'senior': '5+ years'
    };
    return ranges[level] || '2-5 years';
  }

  getCommonBenefits() {
    const benefits = [
      'Health Insurance',
      'Provident Fund',
      'Flexible Working Hours',
      'Work from Home',
      'Learning & Development',
      'Performance Bonus',
      'Food Allowance',
      'Transport Allowance'
    ];
    
    // Return 4-6 random benefits
    const count = 4 + Math.floor(Math.random() * 3);
    return this.shuffleArray(benefits).slice(0, count);
  }

  getCompanySize(companyName) {
    const largeCorp = ['TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Microsoft India', 'Amazon India'];
    if (largeCorp.includes(companyName)) {
      return '10,000+ employees';
    }
    
    const midSize = ['Flipkart', 'Ola', 'Paytm', 'Zomato', 'BYJU\'S'];
    if (midSize.includes(companyName)) {
      return '1,000-10,000 employees';
    }
    
    return '100-1,000 employees';
  }

  getWorkMode() {
    const modes = ['Hybrid', 'On-site', 'Remote', 'Work from Home'];
    const weights = [0.4, 0.3, 0.2, 0.1]; // Hybrid is most common in India
    
    let random = Math.random();
    for (let i = 0; i < modes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return modes[i];
      }
    }
    return 'Hybrid';
  }

  getIndustryForCompany(companyName) {
    for (const [industry, companies] of Object.entries(this.indianCompanies)) {
      if (companies.includes(companyName)) {
        return industry;
      }
    }
    return 'Technology';
  }

  getRecentDate() {
    const daysAgo = Math.floor(Math.random() * 30); // Random date within last 30 days
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  normalizeLinkedInJobs(jobs, candidateSkills) {
    return jobs.map(job => {
      const description = job.description || '';
      const jobSkills = this.extractSkillsFromDescription(description);
      const matchedSkills = candidateSkills.filter(skill => 
        jobSkills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      const missingSkills = jobSkills.filter(jobSkill => 
        !candidateSkills.some(skill => skill.toLowerCase().includes(jobSkill.toLowerCase()))
      );
      
      const matchScore = candidateSkills.length > 0 
        ? Math.round((matchedSkills.length / candidateSkills.length) * 100)
        : 0;

      return {
        title: job.title || '',
        company: job.company || '',
        location: job.location || 'India',
        salary: job.salary || 'Competitive',
        matchScore: Math.min(matchScore, 100),
        keySkillMatches: matchedSkills.slice(0, 5),
        missingSkills: missingSkills.slice(0, 5),
        description: description,
        url: job.url || '',
        postedDate: job.posted_date ? new Date(job.posted_date) : new Date(),
        source: 'linkedin-india',
        experienceRequired: this.extractExperience(description),
        benefits: ['Competitive Salary', 'Health Benefits'],
        companySize: 'Unknown',
        workMode: 'Hybrid',
        industry: 'Technology'
      };
    });
  }

  extractSkillsFromDescription(description) {
    const allSkills = [];
    Object.values(this.indianMarketSkills).forEach(skills => allSkills.push(...skills));
    
    const foundSkills = [];
    const descLower = description.toLowerCase();
    
    allSkills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return [...new Set(foundSkills)]; // Remove duplicates
  }

  extractExperience(description) {
    const expPatterns = [
      /(\d+)[\s-]+(\d+)\s*years?\s*(?:of\s*)?experience/i,
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /experience\s*(?:of\s*)?(\d+)[\s-]+(\d+)\s*years?/i
    ];

    for (const pattern of expPatterns) {
      const match = description.match(pattern);
      if (match) {
        if (match[2]) {
          return `${match[1]}-${match[2]} years`;
        } else {
          return `${match[1]}+ years`;
        }
      }
    }

    return '2-5 years';
  }

  deduplicateJobs(jobs) {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get trending skills in Indian IT market
  getTrendingSkills() {
    return {
      'Hot Skills 2024': ['React', 'Python', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Node.js'],
      'Emerging Technologies': ['Machine Learning', 'AI/ML', 'Blockchain', 'IoT', 'Cloud Computing'],
      'Always in Demand': ['Java', 'JavaScript', 'SQL', 'Git', 'Agile', 'Spring Boot']
    };
  }

  // Get salary insights for Indian market
  getSalaryInsights(role, location, experience) {
    const insights = {
      'Bangalore': 'Tech capital of India, highest salaries for software roles',
      'Mumbai': 'Financial hub, good for fintech and product companies',
      'Delhi/NCR': 'Growing tech scene, competitive salaries',
      'Hyderabad': 'Microsoft, Google presence, good growth opportunities',
      'Chennai': 'Strong IT services presence, stable market',
      'Pune': 'IT hub with good work-life balance'
    };

    return {
      locationInsight: insights[location] || 'Growing tech market with opportunities',
      salaryTrend: 'Salaries have increased 15-20% in 2024',
      growthOpportunity: 'High demand for experienced developers',
      marketDemand: 'Very High'
    };
  }
}

module.exports = IndiaJobsService;