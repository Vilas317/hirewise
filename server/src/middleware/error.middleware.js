const errorHandler = (err, req, res, next) => {
    const logger = require('../utils/logger');

logger.error(err.message);
  
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error',
    });
  };
  
  module.exports = errorHandler;