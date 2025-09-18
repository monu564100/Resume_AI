const mongoose = require('mongoose');
require('dotenv').config();

const ResumeAnalysis = require('./models/ResumeAnalysis');

async function createTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Use the same dev user ID as in auth middleware
    const devUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    console.log('Using dev user ID:', devUserId);
    
    // Clear existing dev-user data
    await ResumeAnalysis.deleteMany({ userId: devUserId });
    
    const testData = [
      {
        userId: devUserId,
        originalFileName: 'software_engineer_resume.pdf',
        atsScore: { 
          overall: 85, 
          keywords: 80, 
          formatting: 90,
          experience: 85,
          education: 88
        },
        personalInfo: { 
          name: 'John Doe', 
          email: 'john.doe@example.com',
          phone: '+1234567890'
        },
        skills: [
          { name: 'JavaScript', level: 90, category: 'Programming' },
          { name: 'React', level: 85, category: 'Frontend' },
          { name: 'Node.js', level: 80, category: 'Backend' },
          { name: 'Python', level: 75, category: 'Programming' },
          { name: 'AWS', level: 70, category: 'Cloud' }
        ],
        jobMatches: [
          {
            title: 'Senior Frontend Developer',
            company: 'Tech Corp',
            matchScore: 92,
            salary: '$90k-120k'
          }
        ],
        improvementSuggestions: [
          {
            category: 'experience',
            suggestion: 'Add more quantifiable achievements',
            impact: 'high',
            difficulty: 'medium'
          },
          {
            category: 'skills',
            suggestion: 'Include cloud certifications',
            impact: 'medium',
            difficulty: 'easy'
          }
        ],
        analysisVersion: '1.0',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        userId: devUserId,
        originalFileName: 'product_manager_resume.docx',
        atsScore: { 
          overall: 78, 
          keywords: 75, 
          formatting: 82,
          experience: 80,
          education: 85
        },
        personalInfo: { 
          name: 'Jane Smith', 
          email: 'jane.smith@example.com',
          phone: '+1987654321'
        },
        skills: [
          { name: 'Product Management', level: 85, category: 'Management' },
          { name: 'Agile', level: 90, category: 'Methodology' },
          { name: 'Data Analysis', level: 75, category: 'Analytics' }
        ],
        jobMatches: [
          {
            title: 'Senior Product Manager',
            company: 'StartupCo',
            matchScore: 88,
            salary: '$110k-140k'
          }
        ],
        improvementSuggestions: [
          {
            category: 'content',
            suggestion: 'Add metrics and KPIs',
            impact: 'high',
            difficulty: 'easy'
          },
          {
            category: 'experience',
            suggestion: 'Include stakeholder management examples',
            impact: 'medium',
            difficulty: 'medium'
          }
        ],
        analysisVersion: '1.0',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20')
      }
    ];
    
    const created = await ResumeAnalysis.insertMany(testData);
    console.log(`Created ${created.length} test analyses`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();