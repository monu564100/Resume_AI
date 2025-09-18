const express = require('express');
const mongoose = require('mongoose');
const { catchAsync } = require('../utils/catchAsync');
const ResumeAnalysis = require('../models/ResumeAnalysis');

const router = express.Router();

// Create test data for development
router.post('/create-test-data', catchAsync(async (req, res) => {
  const testUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
  
  // Create sample resume analyses
  const sampleAnalyses = [
    {
      userId: testUserId,
      originalFileName: 'John_Doe_Resume.pdf',
      atsScore: {
        overall: 85,
        keywords: 78,
        formatting: 92,
        experience: 80,
        education: 90
      },
      extractedText: 'John Doe\nSoftware Engineer\n5 years experience...',
      personalInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          duration: '2021-Present'
        }
      ],
      jobMatches: [
        {
          title: 'Full Stack Developer',
          company: 'StartupCo',
          matchScore: 92,
          salary: '$90k-120k',
          location: 'Remote'
        }
      ],
      improvementSuggestions: [
        'Add more quantifiable achievements',
        'Include cloud certifications',
        'Enhance technical skills section'
      ],
      careerAnalysis: {
        level: 'Senior',
        trajectory: 'Upward',
        strengths: ['Technical expertise', 'Leadership'],
        areas_for_growth: ['Domain knowledge', 'Certifications']
      },
      analysisVersion: '1.0',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      userId: testUserId,
      originalFileName: 'Jane_Smith_Resume.docx',
      atsScore: {
        overall: 78,
        keywords: 72,
        formatting: 85,
        experience: 75,
        education: 82
      },
      extractedText: 'Jane Smith\nProduct Manager\n3 years experience...',
      personalInfo: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321'
      },
      skills: ['Product Management', 'Agile', 'Data Analysis', 'SQL'],
      experience: [
        {
          title: 'Product Manager',
          company: 'Product Inc',
          duration: '2022-Present'
        }
      ],
      jobMatches: [
        {
          title: 'Senior Product Manager',
          company: 'BigTech',
          matchScore: 88,
          salary: '$110k-140k',
          location: 'San Francisco'
        }
      ],
      improvementSuggestions: [
        'Add metrics and KPIs',
        'Include stakeholder management examples',
        'Highlight product launches'
      ],
      careerAnalysis: {
        level: 'Mid-level',
        trajectory: 'Upward',
        strengths: ['Strategic thinking', 'Cross-functional collaboration'],
        areas_for_growth: ['Technical depth', 'Market analysis']
      },
      analysisVersion: '1.0',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20')
    },
    {
      userId: testUserId,
      originalFileName: 'Mike_Johnson_Resume.pdf',
      atsScore: {
        overall: 72,
        keywords: 68,
        formatting: 75,
        experience: 70,
        education: 78
      },
      extractedText: 'Mike Johnson\nData Scientist\n2 years experience...',
      personalInfo: {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+1122334455'
      },
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
      experience: [
        {
          title: 'Data Scientist',
          company: 'Analytics Co',
          duration: '2023-Present'
        }
      ],
      jobMatches: [
        {
          title: 'Machine Learning Engineer',
          company: 'AI Startup',
          matchScore: 82,
          salary: '$95k-125k',
          location: 'New York'
        }
      ],
      improvementSuggestions: [
        'Add more ML project examples',
        'Include publication or research',
        'Expand on business impact of models'
      ],
      careerAnalysis: {
        level: 'Junior',
        trajectory: 'Growing',
        strengths: ['Technical skills', 'Analytical thinking'],
        areas_for_growth: ['Business acumen', 'Communication']
      },
      analysisVersion: '1.0',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10')
    }
  ];

  // Clear existing test data
  await ResumeAnalysis.deleteMany({ userId: testUserId });
  
  // Insert new test data
  const created = await ResumeAnalysis.insertMany(sampleAnalyses);

  res.json({
    success: true,
    message: `Created ${created.length} test analyses`,
    data: created
  });
}));

// Clear test data
router.delete('/clear-test-data', catchAsync(async (req, res) => {
  const devUserId = new require('mongoose').Types.ObjectId('507f1f77bcf86cd799439011');
  const result = await ResumeAnalysis.deleteMany({ userId: devUserId });
  
  res.json({
    success: true,
    message: `Deleted ${result.deletedCount} test analyses`
  });
}));

module.exports = router;