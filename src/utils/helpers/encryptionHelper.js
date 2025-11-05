const crypto = require('crypto');

// Get encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_encryption_key_32_chars!!';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt text
 * @param {String} text - Text to encrypt
 * @returns {String} Encrypted text
 */
const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
};

/**
 * Decrypt text
 * @param {String} text - Text to decrypt
 * @returns {String} Decrypted text
 */
const decrypt = (text) => {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
};

/**
 * Hash text using SHA-256
 * @param {String} text - Text to hash
 * @returns {String} Hashed text
 */
const hash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

/**
 * Generate random token
 * @param {Number} length - Length of token (default: 32)
 * @returns {String} Random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Mask sensitive data (e.g., bank account numbers)
 * @param {String} data - Data to mask
 * @param {Number} visibleChars - Number of characters to keep visible at the end (default: 4)
 * @returns {String} Masked data
 */
const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data) return '';
  
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }
  
  const maskedPart = '*'.repeat(data.length - visibleChars);
  const visiblePart = data.slice(-visibleChars);
  
  return maskedPart + visiblePart;
};

module.exports = {
  encrypt,
  decrypt,
  hash,
  generateToken,
  maskSensitiveData
};