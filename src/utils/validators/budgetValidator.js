const { body, query, param } = require('express-validator');

const createBudgetValidator = [
  body('budgetName')
    .notEmpty()
    .withMessage('Budget name is required')
    .isLength({ max: 100 })
    .withMessage('Budget name must be less than 100 characters'),
  
  body('financialYear')
    .notEmpty()
    .withMessage('Financial year is required')
    .isLength({ max: 10 })
    .withMessage('Financial year must be less than 10 characters'),
  
  body('budgetType')
    .notEmpty()
    .withMessage('Budget type is required')
    .isIn(['Annual', 'Quarterly', 'Project', 'Department'])
    .withMessage('Invalid budget type'),
  
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('budgetLines')
    .isArray({ min: 1 })
    .withMessage('At least one budget line is required'),
  
  body('budgetLines.*.accountId')
    .notEmpty()
    .withMessage('Account ID is required for budget lines'),
  
  body('budgetLines.*.accountName')
    .notEmpty()
    .withMessage('Account name is required for budget lines'),
  
  body('budgetLines.*.budgetCategory')
    .notEmpty()
    .withMessage('Budget category is required for budget lines')
    .isIn(['Income', 'Expense'])
    .withMessage('Invalid budget category'),
  
  body('budgetLines.*.quarters')
    .isArray({ min: 1 })
    .withMessage('At least one quarter is required for budget lines'),
  
  body('budgetLines.*.quarters.*.quarter')
    .isInt({ min: 1, max: 4 })
    .withMessage('Quarter must be between 1 and 4'),
  
  body('budgetLines.*.quarters.*.amount')
    .isNumeric()
    .withMessage('Quarter amount must be a number'),
  
  body('budgetLines.*.totalBudget')
    .isNumeric()
    .withMessage('Total budget must be a number'),
  
  body('totalIncome')
    .optional()
    .isNumeric()
    .withMessage('Total income must be a number'),
  
  body('totalExpense')
    .optional()
    .isNumeric()
    .withMessage('Total expense must be a number'),
  
  body('netBudget')
    .optional()
    .isNumeric()
    .withMessage('Net budget must be a number')
];

const updateBudgetValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format'),
  
  body('budgetName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Budget name must be less than 100 characters'),
  
  body('status')
    .optional()
    .isIn(['Draft', 'Submitted', 'Approved', 'Active', 'Rejected', 'Closed'])
    .withMessage('Invalid status')
];

const getBudgetsValidator = [
  query('financialYear')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Financial year must be less than 10 characters'),
  
  query('status')
    .optional()
    .isIn(['Draft', 'Submitted', 'Approved', 'Active', 'Rejected', 'Closed'])
    .withMessage('Invalid status'),
  
  query('department')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Department must be less than 50 characters'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const getBudgetByIdValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format')
];

const submitBudgetValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format'),
  
  body('submittedBy')
    .notEmpty()
    .withMessage('Submitted by is required'),
  
  body('submittedDate')
    .notEmpty()
    .withMessage('Submitted date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

const approveBudgetValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format'),
  
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['Approve', 'Reject', 'RequestRevision'])
    .withMessage('Invalid action'),
  
  body('approvedBy')
    .notEmpty()
    .withMessage('Approved by is required')
];

const getBudgetVsActualValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format'),
  
  query('asOfDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

const setBudgetAlertValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format'),
  
  body('alertType')
    .notEmpty()
    .withMessage('Alert type is required')
    .isIn(['ThresholdReached', 'QuarterlyReview', 'MonthEnd'])
    .withMessage('Invalid alert type'),
  
  body('threshold')
    .isInt({ min: 0, max: 100 })
    .withMessage('Threshold must be between 0 and 100'),
  
  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isIn(['Daily', 'Weekly', 'Monthly'])
    .withMessage('Invalid frequency')
];

const createBudgetRevisionValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format'),
  
  body('revisionNumber')
    .isInt({ min: 1 })
    .withMessage('Revision number must be a positive integer'),
  
  body('revisionDate')
    .notEmpty()
    .withMessage('Revision date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ max: 500 })
    .withMessage('Reason must be less than 500 characters'),
  
  body('changes')
    .isArray({ min: 1 })
    .withMessage('At least one change is required'),
  
  body('changes.*.accountId')
    .notEmpty()
    .withMessage('Account ID is required for changes'),
  
  body('changes.*.oldAmount')
    .isNumeric()
    .withMessage('Old amount must be a number'),
  
  body('changes.*.newAmount')
    .isNumeric()
    .withMessage('New amount must be a number'),
  
  body('changes.*.justification')
    .notEmpty()
    .withMessage('Justification is required')
    .isLength({ max: 500 })
    .withMessage('Justification must be less than 500 characters')
];

const activateBudgetValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format')
];

const closeBudgetValidator = [
  param('budgetId')
    .notEmpty()
    .withMessage('Budget ID is required')
    .isUUID()
    .withMessage('Invalid budget ID format'),
  
  body('closedBy')
    .notEmpty()
    .withMessage('Closed by is required'),
  
  body('closedDate')
    .notEmpty()
    .withMessage('Closed date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('closureReason')
    .notEmpty()
    .withMessage('Closure reason is required')
    .isLength({ max: 500 })
    .withMessage('Closure reason must be less than 500 characters')
];

module.exports = {
  createBudgetValidator,
  updateBudgetValidator,
  getBudgetsValidator,
  getBudgetByIdValidator,
  submitBudgetValidator,
  approveBudgetValidator,
  getBudgetVsActualValidator,
  setBudgetAlertValidator,
  createBudgetRevisionValidator,
  activateBudgetValidator,
  closeBudgetValidator
};