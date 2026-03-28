const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    logger.info('HTTP', `${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
}

module.exports = requestLogger;
