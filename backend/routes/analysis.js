const express = require('express');
const mongoose = require('mongoose');
const { catchAsync } = require('../utils/catchAsync');
const { protect } = require('../middleware/auth');
const ResumeAnalysis = require('../models/ResumeAnalysis');

const router = express.Router();

// Get analysis history for a user
router.get('/history', protect, catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const analyses = await ResumeAnalysis.find({ 
    userId: req.user.id 
  })
  .select('originalFileName atsScore.overall createdAt analysisVersion')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(Number(limit));

  const total = await ResumeAnalysis.countDocuments({ userId: req.user.id });

  res.json({
    success: true,
    data: {
      analyses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// Get specific analysis by ID
router.get('/:id', protect, catchAsync(async (req, res) => {
  const analysis = await ResumeAnalysis.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  res.json({
    success: true,
    data: analysis
  });
}));

// Get specific insights from an analysis
router.get('/:id/insights/:category', protect, catchAsync(async (req, res) => {
  const { category } = req.params;
  const analysis = await ResumeAnalysis.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  let insights = {};

  switch (category) {
    case 'skills':
      insights = {
        skills: analysis.skills,
        skillGaps: analysis.skillGaps,
        strongSkills: analysis.skillAssessment?.strongSkills,
        developingSkills: analysis.skillAssessment?.developingSkills,
        missingSkills: analysis.skillAssessment?.missingSkills
      };
      break;
    case 'jobs':
      insights = {
        jobMatches: analysis.jobMatches,
        roleMatches: analysis.roleMatches
      };
      break;
    case 'improvements':
      insights = {
        improvementSuggestions: analysis.improvementSuggestions,
        courseSuggestions: analysis.courseSuggestions
      };
      break;
    case 'scores':
      insights = {
        atsScore: analysis.atsScore,
        careerAnalysis: analysis.careerAnalysis
      };
      break;
    case 'personal':
      insights = {
        personalInfo: analysis.personalInfo,
        summary: analysis.summary,
        experience: analysis.experience,
        education: analysis.education,
        certifications: analysis.certifications,
        projects: analysis.projects
      };
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Available: skills, jobs, improvements, scores, personal'
      });
  }

  res.json({
    success: true,
    data: insights
  });
}));

// Delete an analysis
router.delete('/:id', protect, catchAsync(async (req, res) => {
  const analysis = await ResumeAnalysis.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  res.json({
    success: true,
    message: 'Analysis deleted successfully'
  });
}));

// Get analytics/statistics for user
router.get('/stats/overview', protect, catchAsync(async (req, res) => {
  const userId = req.user.id;
  
  const stats = await ResumeAnalysis.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: 1 },
        avgAtsScore: { $avg: '$atsScore.overall' },
        maxAtsScore: { $max: '$atsScore.overall' },
        minAtsScore: { $min: '$atsScore.overall' },
        latestAnalysis: { $max: '$createdAt' }
      }
    }
  ]);

  const topSkills = await ResumeAnalysis.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: '$skills' },
    {
      $group: {
        _id: '$skills.name',
        count: { $sum: 1 },
        avgLevel: { $avg: '$skills.level' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {
        totalAnalyses: 0,
        avgAtsScore: 0,
        maxAtsScore: 0,
        minAtsScore: 0,
        latestAnalysis: null
      },
      topSkills
    }
  });
}));

module.exports = router;