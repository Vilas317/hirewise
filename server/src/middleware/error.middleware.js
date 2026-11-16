const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  if (status >= 500) logger.error(err.stack || err.message || 'Unexpected server error');

  res.status(status).json({
    success: false,
    message: status >= 500 ? 'An unexpected server error occurred.' : err.message,
  });
};

module.exports = errorHandler;
