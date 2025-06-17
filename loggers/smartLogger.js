const logger = require('./logger');

const logCache = new Map();
const DEFAULT_TTL = 60 * 1000; // 60 δευτερόλεπτα

function logOnce(level, message) {
  const key = `${level}:${message}`;
  const now = Date.now();
  const lastLoggedAt = logCache.get(key);

  if (!lastLoggedAt || now - lastLoggedAt > DEFAULT_TTL) {
    logger[level](message);
    logCache.set(key, now);
  }
}

// API ίδιο με το logger σου
module.exports = {
  info: (msg) => logOnce('info', msg),
  error: (msg) => logOnce('error', msg),
  warn: (msg) => logOnce('warn', msg),
  debug: (msg) => logOnce('debug', msg),
};

