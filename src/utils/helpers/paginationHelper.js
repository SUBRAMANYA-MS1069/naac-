/**
 * Calculate pagination parameters
 * @param {Object} query - Request query parameters
 * @returns {Object} Pagination parameters
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  
  return {
    page,
    limit,
    skip
  };
};

/**
 * Build pagination query options
 * @param {Object} query - Request query parameters
 * @returns {Object} Mongoose query options
 */
const getPaginationOptions = (query) => {
  const { page, limit, skip } = getPagination(query);
  
  return {
    page,
    limit,
    skip,
    sort: query.sort || '-createdAt'
  };
};

/**
 * Build pagination metadata
 * @param {Number} total - Total number of items
 * @param {Object} pagination - Pagination parameters
 * @returns {Object} Pagination metadata
 */
const buildPaginationMeta = (total, pagination) => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

module.exports = {
  getPagination,
  getPaginationOptions,
  buildPaginationMeta
};