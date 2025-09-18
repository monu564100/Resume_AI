const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous analysis
  },
  originalFileName: String,
  fileType: String,
  originalFileUrl: String,
  
  // Parsed resume data
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  
  summary: String,
  rawText: String, // Store extracted text for debugging
  
  skills: [{
    name: String,
    level: Number, // 0-100
    category: String,
    yearsOfExperience: Number
  }],
  
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String,
    skills: [String],
    achievements: [String]
  }],
  
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: String,
    honors: [String]
  }],
  
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String
  }],
  
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date
  }],
  
  // Analysis results - Enhanced for Gemini integration
  atsScore: {
    overall: Number,
    breakdown: {
      skills: Number,
      experience: Number,
      education: Number,
      resumeQuality: Number,
      marketFit: Number,
      formatting: Number,
      keywords: Number
    }
  },

  // Enhanced job matching with Indian market focus
  jobMatches: [{
    title: String,
    company: String,
    location: String,
    salary: String,
    matchScore: Number,
    keySkillMatches: [String],
    missingSkills: [String],
    description: String,
    url: String,
    postedDate: Date,
    source: String, // 'linkedin', 'indian-job-board', 'naukri', etc.
    experienceRequired: String,
    benefits: [String],
    companySize: String,
    workMode: String, // 'Remote', 'Hybrid', 'On-site'
    industry: String
  }],
  
  skillGaps: [{
    category: String,
    missing: [String],
    recommendation: String,
    priority: String, // 'high', 'medium', 'low'
    estimatedLearningTime: String
  }],
  
  improvementSuggestions: [{
    category: String, // 'skills', 'experience', 'education', 'formatting', 'content'
    suggestion: String,
    impact: String, // 'high', 'medium', 'low'
    difficulty: String, // 'easy', 'medium', 'hard'
    estimatedTime: String
  }],
  
  courseSuggestions: [{
    skill: String,
    title: String,
    provider: String,
    url: String,
    duration: String,
    level: String, // 'beginner', 'intermediate', 'advanced'
    rating: Number,
    price: String
  }],

  // Enhanced career analysis from Gemini
  careerAnalysis: {
    experienceLevel: String, // 'entry', 'mid', 'senior'
    careerProgression: String,
    industryFit: String,
    salaryRange: String,
    marketDemand: String,
    competitiveAdvantage: String,
    nextCareerSteps: [String]
  },

  // Enhanced skill assessment from Gemini
  skillAssessment: {
    strongSkills: [String],
    developingSkills: [String],
    missingSkills: [String],
    skillGaps: [{
      category: String,
      missing: [String],
      recommendation: String,
      priority: String,
      estimatedLearningTime: String
    }]
  },
  
  keywords: [String],
  overallFeedback: String, // Summary feedback from Gemini
  
  // Job search metadata
  lastJobSearchUpdate: {
    type: Date,
    default: Date.now
  },
  
  // Metadata
  analysisVersion: String,
  extractionMethod: String, // 'enhanced-local', 'affinda', 'rchilli', 'basic-fallback'
  extractionMetadata: mongoose.Schema.Types.Mixed, // Store extraction details
  processed: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });
resumeAnalysisSchema.index({ 'atsScore.overall': -1 });
resumeAnalysisSchema.index({ 'jobMatches.matchScore': -1 });
resumeAnalysisSchema.index({ 'careerAnalysis.experienceLevel': 1 });
resumeAnalysisSchema.index({ 'personalInfo.location': 1 });

// Virtual for analysis age
resumeAnalysisSchema.virtual('analysisAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to check if analysis needs refresh
resumeAnalysisSchema.methods.needsRefresh = function() {
  const daysSinceAnalysis = this.analysisAge;
  return daysSinceAnalysis > 30; // Refresh after 30 days
};

// Static method to find recent analyses for a user
resumeAnalysisSchema.statics.findRecentByUser = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

// Static method to get analysis statistics
resumeAnalysisSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$userId',
        totalAnalyses: { $sum: 1 },
        avgAtsScore: { $avg: '$atsScore.overall' },
        maxAtsScore: { $max: '$atsScore.overall' },
        minAtsScore: { $min: '$atsScore.overall' },
        latestAnalysis: { $max: '$createdAt' }
      }
    }
  ]);
};

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);