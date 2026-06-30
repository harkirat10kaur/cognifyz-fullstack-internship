const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { startTaskSummaryJob } = require('./jobs/taskSummary');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan HTTP logging
app.use(morgan('dev'));

// Custom request logger
/*app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
*/
// Rate limiting
/*const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);
*/

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/github', require('./routes/github'));

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => {
    logger.info('Connected to MongoDB Atlas');
    app.listen(process.env.PORT, () => {
      logger.info(`Server running on port ${process.env.PORT}`);
      // Start background jobs
      startTaskSummaryJob();
    });
  })
  .catch(err => logger.error(`MongoDB connection error: ${err.message}`));