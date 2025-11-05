/**
 * Format date to ISO string
 * @param {Date|String} date - Date to format
 * @returns {String} ISO formatted date string
 */
const formatISODate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Format date to readable string
 * @param {Date|String} date - Date to format
 * @param {String} locale - Locale for formatting (default: 'en-IN')
 * @returns {String} Formatted date string
 */
const formatReadableDate = (date, locale = 'en-IN') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date to short string
 * @param {Date|String} date - Date to format
 * @param {String} locale - Locale for formatting (default: 'en-IN')
 * @returns {String} Formatted date string
 */
const formatShortDate = (date, locale = 'en-IN') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time
 * @param {Date|String} date - Date to format
 * @param {String} locale - Locale for formatting (default: 'en-IN')
 * @returns {String} Formatted date and time string
 */
const formatDateTime = (date, locale = 'en-IN') => {
  if (!date) return '';
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get financial year from date
 * @param {Date|String} date - Date to get financial year from
 * @returns {String} Financial year string (e.g., '2023-24')
 */
const getFinancialYear = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  
  // Financial year in India starts from April (month 3)
  if (month < 3) {
    return `${year - 1}-${String(year).slice(-2)}`;
  } else {
    return `${year}-${String(year + 1).slice(-2)}`;
  }
};

/**
 * Get quarter from date
 * @param {Date|String} date - Date to get quarter from
 * @returns {String} Quarter string (Q1, Q2, Q3, Q4)
 */
const getQuarter = (date) => {
  if (!date) return '';
  
  const month = new Date(date).getMonth();
  
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
};

/**
 * Add days to date
 * @param {Date|String} date - Date to add days to
 * @param {Number} days - Number of days to add
 * @returns {Date} New date
 */
const addDays = (date, days) => {
  if (!date) return null;
  
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Calculate difference in days between two dates
 * @param {Date|String} date1 - First date
 * @param {Date|String} date2 - Second date
 * @returns {Number} Difference in days
 */
const dateDifferenceInDays = (date1, date2) => {
  if (!date1 || !date2) return 0;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
  formatISODate,
  formatReadableDate,
  formatShortDate,
  formatDateTime,
  getFinancialYear,
  getQuarter,
  addDays,
  dateDifferenceInDays
};