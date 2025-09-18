const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
  catchAsync
} = require('../utils/catchAsync');
// Generate JWT token
const generateToken = id => {
  return jwt.sign({
    id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
// Register user
exports.register = catchAsync(async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;
  // Check if user already exists
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already in use'
    });
  }
  // Create user
  const user = await User.create({
    name,
    email,
    password
  });
  // Generate token
  const token = generateToken(user._id);
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
// Login user
exports.login = catchAsync(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  // Check if user exists
  const user = await User.findOne({
    email
  });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  // Generate token
  const token = generateToken(user._id);
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
// Get current user
exports.getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({
    success: true,
    user
  });
});

// Update user profile
exports.updateProfile = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  // Check if email is already taken by another user
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    user
  });
});

// Change password
exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Get user with password
  const user = await User.findById(userId);

  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});