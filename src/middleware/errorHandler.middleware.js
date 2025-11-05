const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: Object.values(err.errors).map(e => e.message),
        timestamp: new Date().toISOString()
      }
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'Duplicate entry found',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Mongoose cast error (invalid ID format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid ID format',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;