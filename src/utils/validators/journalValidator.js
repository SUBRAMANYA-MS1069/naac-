const { body, query, param } = require('express-validator');

const createJournalEntryValidator = [
  body('entryNumber')
    .notEmpty()
    .withMessage('Entry number is required')
    .isLength({ max: 50 })
    .withMessage('Entry number must be less than 50 characters'),
  
  body('entryDate')
    .notEmpty()
    .withMessage('Entry date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('entryType')
    .notEmpty()
    .withMessage('Entry type is required')
    .isIn(['Journal', 'Payment', 'Receipt', 'ContraEntry', 'Adjustment'])
    .withMessage('Invalid entry type'),
  
  body('lineItems')
    .isArray({ min: 1 })
    .withMessage('At least one line item is required'),
  
  body('lineItems.*.accountId')
    .notEmpty()
    .withMessage('Account ID is required for line items'),
  
  body('lineItems.*.debit')
    .optional()
    .isNumeric()
    .withMessage('Debit amount must be a number'),
  
  body('lineItems.*.credit')
    .optional()
    .isNumeric()
    .withMessage('Credit amount must be a number'),
  
  body('totalDebit')
    .optional()
    .isNumeric()
    .withMessage('Total debit must be a number'),
  
  body('totalCredit')
    .optional()
    .isNumeric()
    .withMessage('Total credit must be a number')
];

const updateJournalEntryValidator = [
  param('entryId')
    .notEmpty()
    .withMessage('Entry ID is required')
    .isUUID()
    .withMessage('Invalid entry ID format'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('status')
    .optional()
    .isIn(['Draft', 'Pending', 'Posted', 'Rejected', 'Reversed'])
    .withMessage('Invalid status')
];

const getJournalEntriesValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  
  query('status')
    .optional()
    .isIn(['Draft', 'Pending', 'Posted', 'Rejected', 'Reversed'])
    .withMessage('Invalid status'),
  
  query('entryType')
    .optional()
    .isIn(['Journal', 'Payment', 'Receipt', 'ContraEntry', 'Adjustment'])
    .withMessage('Invalid entry type'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const getJournalEntryByIdValidator = [
  param('entryId')
    .notEmpty()
    .withMessage('Entry ID is required')
    .isUUID()
    .withMessage('Invalid entry ID format')
];

const postJournalEntryValidator = [
  param('entryId')
    .notEmpty()
    .withMessage('Entry ID is required')
    .isUUID()
    .withMessage('Invalid entry ID format'),
  
  body('postDate')
    .notEmpty()
    .withMessage('Post date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

const reverseJournalEntryValidator = [
  param('entryId')
    .notEmpty()
    .withMessage('Entry ID is required')
    .isUUID()
    .withMessage('Invalid entry ID format'),
  
  body('reversalDate')
    .notEmpty()
    .withMessage('Reversal date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ max: 500 })
    .withMessage('Reason must be less than 500 characters')
];

module.exports = {
  createJournalEntryValidator,
  updateJournalEntryValidator,
  getJournalEntriesValidator,
  getJournalEntryByIdValidator,
  postJournalEntryValidator,
  reverseJournalEntryValidator
};