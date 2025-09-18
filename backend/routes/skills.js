const express = require('express');
const router = express.Router();
const UserSkills = require('../models/UserSkills');
const { catchAsync } = require('../utils/catchAsync');

// Get user skills
router.get('/user/:userId', catchAsync(async (req, res) => {
  const { userId } = req.params;
  
  const userSkills = await UserSkills.findByUserId(userId);
  
  if (!userSkills) {
    return res.status(404).json({ 
      success: false, 
      message: 'No skills found for user' 
    });
  }

  const skillCategories = userSkills.skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {});

  res.json({ 
    success: true, 
    data: {
      userId: userSkills.userId,
      totalSkills: userSkills.skills.length,
      categories: skillCategories,
      skills: userSkills.skills,
      lastUpdated: userSkills.lastUpdated,
      source: userSkills.source
    }
  });
}));

// Get current user skills (using auth middleware)
router.get('/current', catchAsync(async (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  const userSkills = await UserSkills.findByUserId(userId);
  
  if (!userSkills) {
    return res.status(404).json({ 
      success: false, 
      message: 'No skills found for current user' 
    });
  }

  const skillCategories = userSkills.skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {});

  const topSkills = userSkills.getTopSkills(10);

  res.json({ 
    success: true, 
    data: {
      totalSkills: userSkills.skills.length,
      categories: skillCategories,
      skills: userSkills.skills,
      topSkills,
      lastUpdated: userSkills.lastUpdated,
      source: userSkills.source
    }
  });
}));

// Add or update a skill manually
router.post('/add', catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { name, level, category, experienceYears } = req.body;
  
  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (!name) {
    return res.status(400).json({ 
      success: false, 
      message: 'Skill name is required' 
    });
  }

  let userSkills = await UserSkills.findByUserId(userId);
  
  if (!userSkills) {
    userSkills = new UserSkills({
      userId,
      skills: [],
      source: 'manual_entry'
    });
  }

  await userSkills.addOrUpdateSkill({
    name,
    level: level || 'Intermediate',
    category: category || 'Technical',
    experienceYears: experienceYears || 1,
    verified: false
  });

  res.json({ 
    success: true, 
    message: 'Skill added/updated successfully',
    data: {
      totalSkills: userSkills.skills.length
    }
  });
}));

module.exports = router;