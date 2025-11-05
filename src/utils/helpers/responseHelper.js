/**
 * Success response formatter
 * @param {Object} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Formatted success response
 */
const successResponse = (data = {}, message = 'Operation successful', statusCode = 200) => {
  return {
    success: true,
    data,
    message,
    statusCode
  };
};

/**
 * Error response formatter
 * @param {String} code - Error code
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 400)
 * @param {Array} details - Error details
 * @returns {Object} Formatted error response
 */
const errorResponse = (code, message, statusCode = 400, details = []) => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    },
    statusCode
  };
};

/**
 * Paginated response formatter
 * @param {Array} data - Response data
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {Number} total - Total items
 * @param {String} message - Success message
 * @returns {Object} Formatted paginated response
 */
const paginatedResponse = (data = [], page = 1, limit = 10, total = 0, message = 'Operation successful') => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};