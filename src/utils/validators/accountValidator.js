const { body, query, param } = require('express-validator');

const createAccountValidator = [
  body('accountCode')
    .notEmpty()
    .withMessage('Account code is required')
    .isLength({ max: 20 })
    .withMessage('Account code must be less than 20 characters'),
  
  body('accountName')
    .notEmpty()
    .withMessage('Account name is required')
    .isLength({ max: 100 })
    .withMessage('Account name must be less than 100 characters'),
  
  body('accountType')
    .notEmpty()
    .withMessage('Account type is required')
    .isIn(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'])
    .withMessage('Invalid account type'),
  
  body('accountCategory')
    .notEmpty()
    .withMessage('Account category is required')
    .isIn(['CurrentAsset', 'FixedAsset', 'CurrentLiability', 'LongTermLiability', 'Income', 'DirectExpense', 'IndirectExpense'])
    .withMessage('Invalid account category'),
  
  body('openingBalance')
    .optional()
    .isNumeric()
    .withMessage('Opening balance must be a number'),
  
  body('currency')
    .optional()
    .isLength({ max: 3 })
    .withMessage('Currency code must be 3 characters'),
  
  body('gstRate')
    .optional()
    .isNumeric()
    .withMessage('GST rate must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('GST rate must be between 0 and 100')
];

const updateAccountValidator = [
  param('accountId')
    .notEmpty()
    .withMessage('Account ID is required')
    .isUUID()
    .withMessage('Invalid account ID format'),
  
  body('accountName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Account name must be less than 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

const getAccountsValidator = [
  query('type')
    .optional()
    .isIn(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'])
    .withMessage('Invalid account type'),
  
  query('category')
    .optional()
    .isIn(['CurrentAsset', 'FixedAsset', 'CurrentLiability', 'LongTermLiability', 'Income', 'DirectExpense', 'IndirectExpense'])
    .withMessage('Invalid account category'),
  
  query('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value'),
  
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const getAccountByIdValidator = [
  param('accountId')
    .notEmpty()
    .withMessage('Account ID is required')
    .isUUID()
    .withMessage('Invalid account ID format')
];

const getAccountBalanceValidator = [
  param('accountId')
    .notEmpty()
    .withMessage('Account ID is required')
    .isUUID()
    .withMessage('Invalid account ID format'),
  
  query('asOfDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

module.exports = {
  createAccountValidator,
  updateAccountValidator,
  getAccountsValidator,
  getAccountByIdValidator,
  getAccountBalanceValidator
};