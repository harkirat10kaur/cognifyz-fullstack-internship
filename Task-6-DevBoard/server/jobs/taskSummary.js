const cron = require('node-cron');
const Task = require('../models/Task');
const logger = require('../utils/logger');

// Runs every day at midnight
const startTaskSummaryJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const total = await Task.countDocuments();
      const done = await Task.countDocuments({ status: 'done' });
      const inProgress = await Task.countDocuments({ status: 'in-progress' });
      const todo = await Task.countDocuments({ status: 'todo' });
      
      logger.info(`Daily Task Summary - Total: ${total}, Done: ${done}, In-Progress: ${inProgress}, Todo: ${todo}`);
    } catch (err) {
      logger.error(`Task summary job failed: ${err.message}`);
    }
  });
  
  logger.info('Task summary cron job scheduled (runs daily at midnight)');
};

module.exports = { startTaskSummaryJob };