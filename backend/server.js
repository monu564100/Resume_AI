const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const userRoutes = require('./routes/user');
const analyzeRoutes = require('./routes/analyze');
const analysisRoutes = require('./routes/analysis');
// const skillsRoutes = require('./routes/skills');
const testDataRoutes = require('./routes/testData');
const {
  errorHandler
} = require('./middleware/errorHandler');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/user', userRoutes);
app.use('/api', analyzeRoutes);
app.use('/api/analysis', analysisRoutes);
// app.use('/api/skills', skillsRoutes);
app.use('/api/test', testDataRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
// Error handling middleware
app.use(errorHandler);
// Start server immediately; don't block on DB connection
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/api/health`);
});

// Database connection with retry (non-blocking)
const connectWithRetry = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in environment. Please set it in .env');
    return;
  }
  mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err.message || err);
    console.log('Retrying MongoDB connection in 3s...');
    setTimeout(connectWithRetry, 3000);
  });
};

connectWithRetry();