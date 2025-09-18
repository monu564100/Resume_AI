export const demoResumeData = {
  fileName: 'john_doe_resume.pdf',
  uploadedAt: '2023-06-15T10:30:00Z',
  parsed: true,
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe'
  },
  summary: 'Experienced software engineer with 5+ years of experience in full-stack development. Passionate about building scalable web applications and solving complex problems.',
  skills: [{
    name: 'JavaScript',
    level: 90,
    category: 'Programming'
  }, {
    name: 'React',
    level: 85,
    category: 'Framework'
  }, {
    name: 'TypeScript',
    level: 80,
    category: 'Programming'
  }, {
    name: 'Node.js',
    level: 75,
    category: 'Backend'
  }, {
    name: 'GraphQL',
    level: 70,
    category: 'API'
  }, {
    name: 'SQL',
    level: 65,
    category: 'Database'
  }, {
    name: 'AWS',
    level: 60,
    category: 'Cloud'
  }, {
    name: 'Docker',
    level: 55,
    category: 'DevOps'
  }, {
    name: 'Git',
    level: 85,
    category: 'Version Control'
  }, {
    name: 'HTML/CSS',
    level: 80,
    category: 'Frontend'
  }, {
    name: 'Redux',
    level: 75,
    category: 'State Management'
  }, {
    name: 'Jest',
    level: 70,
    category: 'Testing'
  }],
  experience: [{
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    startDate: '2021-01',
    endDate: 'Present',
    description: "Lead developer for the company's flagship product, a SaaS platform serving 100K+ users. Implemented new features, improved performance, and mentored junior developers.",
    achievements: ['Reduced page load time by 40% through code optimization and lazy loading', 'Implemented CI/CD pipeline that reduced deployment time by 60%', 'Led migration from REST to GraphQL, improving data fetching efficiency']
  }, {
    title: 'Full Stack Developer',
    company: 'WebSolutions Co.',
    location: 'San Jose, CA',
    startDate: '2018-03',
    endDate: '2020-12',
    description: 'Developed and maintained multiple web applications for clients in finance and healthcare sectors.',
    achievements: ['Built responsive web applications using React and Node.js', 'Implemented authentication system with JWT and OAuth', 'Optimized database queries resulting in 30% faster response times']
  }],
  education: [{
    degree: 'Master of Science in Computer Science',
    institution: 'Stanford University',
    location: 'Stanford, CA',
    graduationDate: '2018',
    gpa: '3.8/4.0'
  }, {
    degree: 'Bachelor of Science in Software Engineering',
    institution: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    graduationDate: '2016',
    gpa: '3.7/4.0'
  }],
  certifications: [{
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2022-05',
    expires: '2025-05'
  }, {
    name: 'Professional Scrum Master I',
    issuer: 'Scrum.org',
    date: '2021-02'
  }],
  languages: [{
    name: 'English',
    proficiency: 'Native'
  }, {
    name: 'Spanish',
    proficiency: 'Professional'
  }, {
    name: 'French',
    proficiency: 'Conversational'
  }],
  roleMatches: [{
    title: 'Senior Frontend Engineer',
    company: 'TechGiant Corp',
    matchScore: 92,
    keySkillMatches: ['React', 'TypeScript', 'Redux'],
    missingSkills: ['Vue.js'],
    salary: '$150,000 - $180,000'
  }, {
    title: 'Full Stack Developer',
    company: 'Startup Innovators',
    matchScore: 87,
    keySkillMatches: ['JavaScript', 'Node.js', 'React'],
    missingSkills: ['MongoDB', 'AWS Lambda'],
    salary: '$130,000 - $160,000'
  }, {
    title: 'Software Engineer',
    company: 'Enterprise Solutions Inc.',
    matchScore: 81,
    keySkillMatches: ['JavaScript', 'SQL', 'Git'],
    missingSkills: ['Java', 'Spring Boot', 'Kubernetes'],
    salary: '$140,000 - $170,000'
  }, {
    title: 'Frontend Developer',
    company: 'Creative Web Agency',
    matchScore: 78,
    keySkillMatches: ['HTML/CSS', 'JavaScript', 'React'],
    missingSkills: ['Angular', 'Sass'],
    salary: '$110,000 - $135,000'
  }, {
    title: 'Backend Engineer',
    company: 'Data Systems Corp',
    matchScore: 65,
    keySkillMatches: ['Node.js', 'SQL'],
    missingSkills: ['Python', 'Django', 'PostgreSQL'],
    salary: '$130,000 - $160,000'
  }],
  skillGaps: [{
    category: 'Frontend',
    missing: ['Vue.js', 'Angular', 'Svelte'],
    recommendation: 'Learning Vue.js would significantly increase your job matches in the frontend space.'
  }, {
    category: 'Backend',
    missing: ['Python', 'Java', 'Go'],
    recommendation: 'Adding a statically typed language like Java or Go to your skillset would broaden your backend opportunities.'
  }, {
    category: 'DevOps',
    missing: ['Kubernetes', 'Terraform', 'Jenkins'],
    recommendation: 'Kubernetes knowledge is increasingly required for senior engineering positions.'
  }],
  overallScore: 85,
  scoreBreakdown: {
    skills: 88,
    experience: 90,
    education: 95,
    resumeQuality: 82,
    marketFit: 78
  },
  improvementSuggestions: ['Add more quantifiable achievements to your work experience', 'Highlight leadership experience more prominently', 'Consider adding a portfolio link to showcase projects', "Add specific examples of complex problems you've solved"]
};