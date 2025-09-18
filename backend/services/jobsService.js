const axios = require('axios');
const IndiaJobsService = require('./indiaJobsService');

class JobsService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.baseUrl = 'https://linkedin-jobs-search.p.rapidapi.com';
    this.indiaJobsService = new IndiaJobsService();
  }

  async findMatchingJobs(skills, location = 'India', limit = 10) {
    try {
      // Check if location is in India or user prefers Indian jobs
      const isIndianLocation = this.isIndianLocation(location);
      
      if (isIndianLocation) {
        console.log('Using India-specific job search');
        return await this.indiaJobsService.findMatchingJobs(skills, location, 'mid', limit);
      }
      // For non-Indian locations, try RapidAPI if key present
      if (!this.rapidApiKey || this.rapidApiKey === 'your_rapidapi_key_here') {
        console.warn('RAPIDAPI_KEY missing – falling back to mock jobs');
        return this.getMockJobs(skills);
      }

      const skillsQuery = skills.slice(0, 3).join(' '); // Use top 3 skills
      
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          keywords: skillsQuery,
          location: location,
          limit: limit
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
        }
      });

      const results = this.normalizeLinkedInJobs(response.data.jobs || [], skills);
      if (!results.length) {
        console.warn('RapidAPI returned no jobs, providing mock fallback');
        return this.getMockJobs(skills);
      }
      return results;
    } catch (error) {
      console.error('Jobs API error:', error.message);
      // Fallback to India jobs if available, otherwise mock jobs
      if (this.isIndianLocation(location)) {
        return await this.indiaJobsService.findMatchingJobs(skills, location, 'mid', limit);
      }
      return this.getMockJobs(skills);
    }
  }

  isIndianLocation(location) {
    const indianKeywords = [
      'india', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 
      'kolkata', 'gurgaon', 'noida', 'ahmedabad', 'jaipur', 'kochi', 'indore',
      'bengaluru', 'new delhi', 'navi mumbai', 'ghaziabad', 'faridabad'
    ];
    
    const locationLower = location.toLowerCase();
    return indianKeywords.some(keyword => locationLower.includes(keyword)) || 
           location === 'India' || 
           locationLower === '';
  }

  normalizeLinkedInJobs(jobs, candidateSkills) {
    return jobs.map(job => {
      const jobSkills = this.extractSkillsFromDescription(job.description || '');
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
        location: job.location || '',
        salary: job.salary || 'Not specified',
        matchScore: Math.min(matchScore, 100),
        keySkillMatches: matchedSkills.slice(0, 5),
        missingSkills: missingSkills.slice(0, 5),
        description: job.description || '',
        url: job.url || '',
        postedDate: job.posted_date ? new Date(job.posted_date) : new Date(),
        source: 'linkedin'
      };
    });
  }

  extractSkillsFromDescription(description) {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'Jenkins', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'TypeScript',
      'Express', 'Spring', 'Django', 'Flask', 'Laravel', 'Ruby on Rails',
      'Machine Learning', 'Data Science', 'AI', 'DevOps', 'Cloud Computing'
    ];

    const foundSkills = [];
    const descLower = description.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return foundSkills;
  }

  getMockJobs(candidateSkills) {
    const mockJobs = [
      {
        title: 'Senior Full Stack Developer',
        company: 'Flipkart',
        location: 'Bangalore, India',
        salary: '₹15-25 LPA',
        description: 'Looking for a senior full stack developer with experience in React, Node.js, MongoDB, and AWS. Join India\'s leading e-commerce platform.',
        url: 'https://flipkart.com/careers',
        posted_date: new Date().toISOString()
      },
      {
        title: 'Software Development Engineer',
        company: 'Amazon India',
        location: 'Hyderabad, India',
        salary: '₹12-20 LPA',
        description: 'Software engineer position requiring expertise in Java, Python, AWS, and distributed systems. Work on products used by millions.',
        url: 'https://amazon.jobs/en-in',
        posted_date: new Date().toISOString()
      },
      {
        title: 'Frontend Developer',
        company: 'Zomato',
        location: 'Gurgaon, India',
        salary: '₹10-18 LPA',
        description: 'Frontend developer needed with strong skills in React, JavaScript, TypeScript, and modern CSS frameworks.',
        url: 'https://careers.zomato.com',
        posted_date: new Date().toISOString()
      },
      {
        title: 'DevOps Engineer',
        company: 'Paytm',
        location: 'Noida, India',
        salary: '₹18-30 LPA',
        description: 'DevOps engineer role focusing on AWS, Docker, Kubernetes, Jenkins, and infrastructure automation.',
        url: 'https://jobs.paytm.com',
        posted_date: new Date().toISOString()
      },
      {
        title: 'Backend Developer',
        company: 'BYJU\'S',
        location: 'Mumbai, India',
        salary: '₹8-15 LPA',
        description: 'Backend developer position with focus on Node.js, Express.js, MongoDB, and microservices architecture.',
        url: 'https://byjus.com/careers',
        posted_date: new Date().toISOString()
      }
    ];

    return this.normalizeLinkedInJobs(mockJobs, candidateSkills);
  }

  async searchJobsByTitle(jobTitle, location = 'United States', limit = 5) {
    try {
      if (!this.rapidApiKey || this.rapidApiKey === 'your_rapidapi_key_here') {
        return this.getMockJobsByTitle(jobTitle);
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          keywords: jobTitle,
          location: location,
          limit: limit
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
        }
      });

      return response.data.jobs || [];
    } catch (error) {
      console.error('Job search error:', error.message);
      return this.getMockJobsByTitle(jobTitle);
    }
  }

  getMockJobsByTitle(jobTitle) {
    return [
      {
        title: jobTitle,
        company: 'Example Corp',
        location: 'Remote',
        salary: 'Competitive',
        description: `${jobTitle} position with competitive salary and benefits.`,
        url: 'https://example.com/job',
        posted_date: new Date().toISOString()
      }
    ];
  }
}

// Legacy export for backward compatibility
exports.searchLinkedInJobs = async ({ query, location = 'Remote', rows = 10 }) => {
  const jobsService = new JobsService();
  const results = await jobsService.findMatchingJobs([query], location, rows);
  return results.map(job => ({
    title: job.title,
    company: job.company,
    location: job.location,
    url: job.url,
    description: job.description,
    skills: job.keySkillMatches
  }));
};

module.exports = JobsService;
