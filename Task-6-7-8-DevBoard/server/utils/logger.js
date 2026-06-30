const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function log(level, message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [${level}] ${message}\n`;
  
  console.log(entry.trim());
  // fs.appendFileSync(logFile, entry);
}

module.exports = {
  info: (msg) => log('INFO', msg),
  error: (msg) => log('ERROR', msg),
  warn: (msg) => log('WARN', msg)
};