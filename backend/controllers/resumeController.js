const Resume = require('../models/Resume');
const {
  catchAsync
} = require('../utils/catchAsync');
const {
  parseResume,
  analyzeResumeWithGemini
} = require('../services/resumeService');
// Upload resume
exports.uploadResume = catchAsync(async (req, res) => {
  const {
    fileName,
    fileContent,
    fileType
  } = req.body;
  if (!fileName || !fileContent || !fileType) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
  // Create resume
  const resume = await Resume.create({
    user: req.user.id,
    fileName,
    fileContent,
    fileType
  });
  // Parse the resume content (basic parsing)
  const parsedData = await parseResume(fileContent, fileType);
  // Update resume with parsed data
  resume.parsedData = parsedData;
  await resume.save();
  res.status(201).json({
    success: true,
    resume
  });
});
// Analyze resume with Gemini
exports.analyzeResume = catchAsync(async (req, res) => {
  const resumeId = req.params.id;
  // Find resume
  const resume = await Resume.findOne({
    _id: resumeId,
    user: req.user.id
  });
  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }
  // Analyze resume with Gemini
  const analysis = await analyzeResumeWithGemini(resume.parsedData);
  // Update resume with analysis
  resume.analysis = analysis;
  resume.lastUpdated = Date.now();
  await resume.save();
  res.status(200).json({
    success: true,
    analysis
  });
});
// Get user resumes
exports.getUserResumes = catchAsync(async (req, res) => {
  const resumes = await Resume.find({
    user: req.user.id
  }).sort('-createdAt');
  res.status(200).json({
    success: true,
    count: resumes.length,
    resumes
  });
});
// Get resume by id
exports.getResumeById = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }
  res.status(200).json({
    success: true,
    resume
  });
});
// Delete resume
exports.deleteResume = catchAsync(async (req, res) => {
  const resume = await Resume.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });
  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }
  res.status(200).json({
    success: true,
    message: 'Resume deleted successfully'
  });
});