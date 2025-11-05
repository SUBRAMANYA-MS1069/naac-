/**
 * Format number as currency
 * @param {Number} amount - Amount to format
 * @param {String} currency - Currency code (default: 'INR')
 * @param {String} locale - Locale for formatting (default: 'en-IN')
 * @returns {String} Formatted currency string
 */
const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format currency without symbol
 * @param {Number} amount - Amount to format
 * @param {Number} decimals - Number of decimal places (default: 2)
 * @returns {String} Formatted number string
 */
const formatCurrencyNumber = (amount, decimals = 2) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

/**
 * Convert words to number
 * @param {String} words - Words representation of number
 * @returns {Number} Numeric value
 */
const wordsToNumber = (words) => {
  const wordMap = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'forty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90
  };

  const wordsArray = words.toLowerCase().split(' ');
  let result = 0;
  let temp = 0;

  for (let i = 0; i < wordsArray.length; i++) {
    const word = wordsArray[i];
    
    if (wordMap[word] !== undefined) {
      temp += wordMap[word];
    } else if (word === 'hundred') {
      temp *= 100;
    } else if (word === 'thousand') {
      result += temp * 1000;
      temp = 0;
    } else if (word === 'lakh' || word === 'lac') {
      result += temp * 100000;
      temp = 0;
    } else if (word === 'crore') {
      result += temp * 10000000;
      temp = 0;
    }
  }

  return result + temp;
};

/**
 * Convert number to words (Indian numbering system)
 * @param {Number} num - Number to convert
 * @returns {String} Words representation
 */
const numberToWords = (num) => {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertHundreds = (n) => {
    let str = '';
    if (n > 99) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str;
  };
  
  if (num < 0) return 'Minus ' + numberToWords(-num);
  
  let result = '';
  if (Math.floor(num / 10000000) > 0) {
    result += convertHundreds(Math.floor(num / 10000000)) + 'Crore ';
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    result += convertHundreds(Math.floor(num / 100000)) + 'Lakh ';
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    result += convertHundreds(Math.floor(num / 1000)) + 'Thousand ';
    num %= 1000;
  }
  if (num > 0) {
    result += convertHundreds(num);
  }
  
  return result.trim() + ' Only';
};

module.exports = {
  formatCurrency,
  formatCurrencyNumber,
  wordsToNumber,
  numberToWords
};