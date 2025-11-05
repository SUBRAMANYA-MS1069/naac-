const { body, query, param } = require('express-validator');

const createSalaryStructureValidator = [
  body('structureName')
    .notEmpty()
    .withMessage('Structure name is required')
    .isLength({ max: 100 })
    .withMessage('Structure name must be less than 100 characters'),
  
  body('designation')
    .notEmpty()
    .withMessage('Designation is required')
    .isLength({ max: 100 })
    .withMessage('Designation must be less than 100 characters'),
  
  body('effectiveFrom')
    .notEmpty()
    .withMessage('Effective from date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('components.earnings')
    .isArray({ min: 1 })
    .withMessage('At least one earning component is required'),
  
  body('components.earnings.*.componentName')
    .notEmpty()
    .withMessage('Earning component name is required'),
  
  body('components.earnings.*.componentType')
    .notEmpty()
    .withMessage('Earning component type is required')
    .isIn(['Fixed', 'Allowance'])
    .withMessage('Invalid earning component type'),
  
  body('components.deductions')
    .isArray()
    .withMessage('Deductions must be an array'),
  
  body('components.deductions.*.componentName')
    .notEmpty()
    .withMessage('Deduction component name is required'),
  
  body('ctc')
    .isNumeric()
    .withMessage('CTC must be a number')
];

const updateSalaryStructureValidator = [
  param('structureId')
    .notEmpty()
    .withMessage('Structure ID is required')
    .isUUID()
    .withMessage('Invalid structure ID format'),
  
  body('structureName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Structure name must be less than 100 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

const getSalaryStructuresValidator = [
  query('designation')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Designation must be less than 100 characters'),
  
  query('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const getSalaryStructureByIdValidator = [
  param('structureId')
    .notEmpty()
    .withMessage('Structure ID is required')
    .isUUID()
    .withMessage('Invalid structure ID format')
];

const assignSalaryStructureValidator = [
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required'),
  
  body('salaryStructureId')
    .notEmpty()
    .withMessage('Salary structure ID is required'),
  
  body('effectiveFrom')
    .notEmpty()
    .withMessage('Effective from date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

const processMonthlySalaryValidator = [
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
];

const getSalaryProcessingStatusValidator = [
  param('batchId')
    .notEmpty()
    .withMessage('Batch ID is required')
    .isUUID()
    .withMessage('Invalid batch ID format')
];

const getEmployeeSalarySlipValidator = [
  param('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required'),
  
  query('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  query('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
];

const disburseSalaryValidator = [
  body('batchId')
    .notEmpty()
    .withMessage('Batch ID is required'),
  
  body('disbursementDate')
    .notEmpty()
    .withMessage('Disbursement date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('disbursementMode')
    .notEmpty()
    .withMessage('Disbursement mode is required')
    .isIn(['BankTransfer', 'Cheque', 'Cash'])
    .withMessage('Invalid disbursement mode')
];

const generateForm16Validator = [
  param('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required'),
  
  query('financialYear')
    .notEmpty()
    .withMessage('Financial year is required')
    .isLength({ max: 10 })
    .withMessage('Financial year must be less than 10 characters')
];

const generatePFStatementValidator = [
  param('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required'),
  
  query('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  query('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

const generateESIStatementValidator = [
  query('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  query('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
];

const tdsCalculationValidator = [
  param('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required'),
  
  query('financialYear')
    .notEmpty()
    .withMessage('Financial year is required')
    .isLength({ max: 10 })
    .withMessage('Financial year must be less than 10 characters')
];

module.exports = {
  createSalaryStructureValidator,
  updateSalaryStructureValidator,
  getSalaryStructuresValidator,
  getSalaryStructureByIdValidator,
  assignSalaryStructureValidator,
  processMonthlySalaryValidator,
  getSalaryProcessingStatusValidator,
  getEmployeeSalarySlipValidator,
  disburseSalaryValidator,
  generateForm16Validator,
  generatePFStatementValidator,
  generateESIStatementValidator,
  tdsCalculationValidator
};