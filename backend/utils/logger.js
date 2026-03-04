/**
 * utils/logger.js
 * -------------------------------------------------
 * Lightweight structured logger for InternSieve.
 * -------------------------------------------------
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] ?? 1;

function fmt(level, module, msg, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] [${module}] ${msg}`;
  if (meta) return `${base} ${JSON.stringify(meta)}`;
  return base;
}

const logger = {
  debug(module, msg, meta) {
    if (currentLevel <= 0) console.debug(fmt('debug', module, msg, meta));
  },
  info(module, msg, meta) {
    if (currentLevel <= 1) console.log(fmt('info', module, msg, meta));
  },
  warn(module, msg, meta) {
    if (currentLevel <= 2) console.warn(fmt('warn', module, msg, meta));
  },
  error(module, msg, meta) {
    if (currentLevel <= 3) console.error(fmt('error', module, msg, meta));
  },
};

module.exports = logger;
