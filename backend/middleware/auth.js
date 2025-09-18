const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const {
  catchAsync
} = require('../utils/catchAsync');

// Use a consistent dev user ID
const DEV_USER_ID = '507f1f77bcf86cd799439011'; // Fixed ObjectId for development

// Protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // Allow bypass in local/dev when explicitly enabled
  if (process.env.SKIP_AUTH === 'true') {
    req.user = { id: DEV_USER_ID, role: 'user' };
    return next();
  }
  let token;
  // Check if token is in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }
    // Set user in request
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
});
// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};