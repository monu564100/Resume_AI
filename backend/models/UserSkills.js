const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  category: {
    type: String,
    enum: ['Technical', 'Programming', 'Framework', 'Tool', 'Database', 'Cloud', 'Soft Skill', 'Language', 'Other'],
    default: 'Technical'
  },
  experienceYears: {
    type: Number,
    min: 0,
    max: 50,
    default: 1
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const userSkillsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [skillSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['resume_analysis', 'manual_entry', 'profile_update'],
    default: 'resume_analysis'
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeAnalysis'
  }
}, {
  timestamps: true
});

// Index for efficient queries (remove duplicates)
userSkillsSchema.index({ 'skills.name': 1 });
userSkillsSchema.index({ 'skills.category': 1 });

// Method to add or update a skill
userSkillsSchema.methods.addOrUpdateSkill = function(skillData) {
  const existingSkillIndex = this.skills.findIndex(
    skill => skill.name.toLowerCase() === skillData.name.toLowerCase()
  );
  
  if (existingSkillIndex !== -1) {
    // Update existing skill
    this.skills[existingSkillIndex] = { ...this.skills[existingSkillIndex].toObject(), ...skillData };
  } else {
    // Add new skill
    this.skills.push(skillData);
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Method to get skills by category
userSkillsSchema.methods.getSkillsByCategory = function(category) {
  return this.skills.filter(skill => skill.category === category);
};

// Method to get top skills (by level and experience)
userSkillsSchema.methods.getTopSkills = function(limit = 10) {
  const levelWeight = { 'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1 };
  
  return this.skills
    .map(skill => ({
      ...skill.toObject(),
      score: (levelWeight[skill.level] || 1) * Math.log(skill.experienceYears + 1)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Static method to find user skills
userSkillsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

// Static method to create or update user skills
userSkillsSchema.statics.createOrUpdate = function(userId, skillsData, analysisId = null) {
  return this.findOneAndUpdate(
    { userId },
    {
      skills: skillsData,
      lastUpdated: new Date(),
      analysisId
    },
    {
      upsert: true,
      new: true,
      runValidators: true
    }
  );
};

module.exports = mongoose.model('UserSkills', userSkillsSchema);