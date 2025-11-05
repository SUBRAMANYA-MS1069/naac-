/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle mongoose validation errors
 * @param {Object} err - Mongoose validation error
 * @returns {AppError} Formatted error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

/**
 * Handle mongoose duplicate key errors
 * @param {Object} err - Mongoose duplicate key error
 * @returns {AppError} Formatted error
 */
const handleDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400, 'DUPLICATE_ENTRY');
};

/**
 * Handle mongoose cast errors
 * @param {Object} err - Mongoose cast error
 * @returns {AppError} Formatted error
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400, 'INVALID_ID');
};

/**
 * Handle JWT errors
 * @returns {AppError} Formatted error
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401, 'INVALID_TOKEN');
};

/**
 * Handle JWT expired errors
 * @returns {AppError} Formatted error
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401, 'TOKEN_EXPIRED');
};

module.exports = {
  AppError,
  handleValidationError,
  handleDuplicateKeyError,
  handleCastError,
  handleJWTError,
  handleJWTExpiredError
};