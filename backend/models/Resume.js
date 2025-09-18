const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileContent: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'txt'],
    required: true
  },
  parsedData: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String
    },
    summary: String,
    skills: [{
      name: String,
      level: Number,
      category: String
    }],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      description: String,
      achievements: [String]
    }],
    education: [{
      degree: String,
      institution: String,
      location: String,
      graduationDate: String,
      gpa: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      expires: String
    }],
    languages: [{
      name: String,
      proficiency: String
    }]
  },
  analysis: {
    overallScore: Number,
    scoreBreakdown: {
      skills: Number,
      experience: Number,
      education: Number,
      resumeQuality: Number,
      marketFit: Number
    },
    roleMatches: [{
      title: String,
      company: String,
      matchScore: Number,
      keySkillMatches: [String],
      missingSkills: [String],
      salary: String
    }],
    skillGaps: [{
      category: String,
      missing: [String],
      recommendation: String
    }],
    improvementSuggestions: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Resume', ResumeSchema);