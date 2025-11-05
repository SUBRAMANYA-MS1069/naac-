/**
 * Format number with commas (Indian numbering system)
 * @param {Number} num - Number to format
 * @returns {String} Formatted number string
 */
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  // Convert to string and split integer and decimal parts
  const parts = num.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';
  
  // Format integer part with commas (Indian system)
  let formattedInteger = '';
  const length = integerPart.length;
  
  if (length > 3) {
    formattedInteger = integerPart.slice(0, length - 3) + ',' + integerPart.slice(length - 3);
    if (length > 5) {
      formattedInteger = integerPart.slice(0, length - 5) + ',' + formattedInteger;
    }
    if (length > 7) {
      formattedInteger = integerPart.slice(0, length - 7) + ',' + formattedInteger;
    }
    // Continue for larger numbers...
  } else {
    formattedInteger = integerPart;
  }
  
  // Add decimal part if exists
  if (decimalPart) {
    return formattedInteger + '.' + decimalPart;
  }
  
  return formattedInteger;
};

/**
 * Format percentage
 * @param {Number} value - Percentage value
 * @param {Number} decimals - Number of decimal places (default: 2)
 * @returns {String} Formatted percentage string
 */
const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  
  return (value).toFixed(decimals) + '%';
};

/**
 * Format ratio
 * @param {Number} numerator - Numerator
 * @param {Number} denominator - Denominator
 * @param {Number} decimals - Number of decimal places (default: 2)
 * @returns {String} Formatted ratio string
 */
const formatRatio = (numerator, denominator, decimals = 2) => {
  if (denominator === 0) return '0';
  
  return (numerator / denominator).toFixed(decimals);
};

/**
 * Round to specified decimal places
 * @param {Number} num - Number to round
 * @param {Number} decimals - Number of decimal places (default: 2)
 * @returns {Number} Rounded number
 */
const roundTo = (num, decimals = 2) => {
  if (num === null || num === undefined) return 0;
  
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

/**
 * Format large numbers with abbreviations (K, M, B)
 * @param {Number} num - Number to format
 * @returns {String} Formatted number string with abbreviation
 */
const formatLargeNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + 'Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + 'L';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  
  return num.toString();
};

module.exports = {
  formatNumber,
  formatPercentage,
  formatRatio,
  roundTo,
  formatLargeNumber
};