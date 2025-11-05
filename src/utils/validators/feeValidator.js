const { body, query, param } = require('express-validator');

const createFeeStructureValidator = [
  body('structureName')
    .notEmpty()
    .withMessage('Structure name is required')
    .isLength({ max: 100 })
    .withMessage('Structure name must be less than 100 characters'),
  
  body('academicYear')
    .notEmpty()
    .withMessage('Academic year is required')
    .isLength({ max: 10 })
    .withMessage('Academic year must be less than 10 characters'),
  
  body('feeType')
    .notEmpty()
    .withMessage('Fee type is required')
    .isIn(['Tuition', 'Admission', 'Examination', 'Library', 'Laboratory', 'Hostel', 'Transport', 'Other'])
    .withMessage('Invalid fee type'),
  
  body('components')
    .isArray({ min: 1 })
    .withMessage('At least one component is required'),
  
  body('components.*.componentName')
    .notEmpty()
    .withMessage('Component name is required'),
  
  body('components.*.amount')
    .isNumeric()
    .withMessage('Component amount must be a number'),
  
  body('totalFee')
    .isNumeric()
    .withMessage('Total fee must be a number'),
  
  body('paymentSchedule')
    .isArray({ min: 1 })
    .withMessage('At least one payment schedule is required'),
  
  body('paymentSchedule.*.installmentNumber')
    .isInt({ min: 1 })
    .withMessage('Installment number must be a positive integer'),
  
  body('paymentSchedule.*.dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('paymentSchedule.*.amount')
    .isNumeric()
    .withMessage('Installment amount must be a number'),
  
  body('effectiveFrom')
    .notEmpty()
    .withMessage('Effective from date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

const updateFeeStructureValidator = [
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

const getFeeStructuresValidator = [
  query('academicYear')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Academic year must be less than 10 characters'),
  
  query('program')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Program must be less than 50 characters'),
  
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

const getFeeStructureByIdValidator = [
  param('structureId')
    .notEmpty()
    .withMessage('Structure ID is required')
    .isUUID()
    .withMessage('Invalid structure ID format')
];

const generateFeeInvoiceValidator = [
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required'),
  
  body('feeStructureId')
    .notEmpty()
    .withMessage('Fee structure ID is required'),
  
  body('academicYear')
    .notEmpty()
    .withMessage('Academic year is required')
    .isLength({ max: 10 })
    .withMessage('Academic year must be less than 10 characters'),
  
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

const getStudentInvoicesValidator = [
  param('studentId')
    .notEmpty()
    .withMessage('Student ID is required'),
  
  query('academicYear')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Academic year must be less than 10 characters'),
  
  query('status')
    .optional()
    .isIn(['Pending', 'PartiallyPaid', 'Paid', 'Overdue', 'Cancelled'])
    .withMessage('Invalid status')
];

const getInvoiceByIdValidator = [
  param('invoiceId')
    .notEmpty()
    .withMessage('Invoice ID is required')
    .isUUID()
    .withMessage('Invalid invoice ID format')
];

const recordFeePaymentValidator = [
  body('invoiceId')
    .notEmpty()
    .withMessage('Invoice ID is required'),
  
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required'),
  
  body('paymentDate')
    .notEmpty()
    .withMessage('Payment date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('paymentMode')
    .notEmpty()
    .withMessage('Payment mode is required')
    .isIn(['Cash', 'Cheque', 'DD', 'NetBanking', 'UPI', 'Card', 'OnlinePaymentGateway'])
    .withMessage('Invalid payment mode'),
  
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  
  body('allocations')
    .isArray({ min: 1 })
    .withMessage('At least one allocation is required'),
  
  body('allocations.*.feeComponent')
    .notEmpty()
    .withMessage('Fee component is required'),
  
  body('allocations.*.amount')
    .isNumeric()
    .withMessage('Allocation amount must be a number')
];

const getPaymentHistoryValidator = [
  param('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
];

const initiateRefundValidator = [
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required'),
  
  body('paymentId')
    .notEmpty()
    .withMessage('Payment ID is required'),
  
  body('refundAmount')
    .isNumeric()
    .withMessage('Refund amount must be a number'),
  
  body('refundReason')
    .notEmpty()
    .withMessage('Refund reason is required')
    .isLength({ max: 500 })
    .withMessage('Refund reason must be less than 500 characters'),
  
  body('refundMode')
    .notEmpty()
    .withMessage('Refund mode is required')
    .isIn(['Cash', 'Cheque', 'BankTransfer'])
    .withMessage('Invalid refund mode')
];

const createScholarshipValidator = [
  body('scholarshipName')
    .notEmpty()
    .withMessage('Scholarship name is required')
    .isLength({ max: 100 })
    .withMessage('Scholarship name must be less than 100 characters'),
  
  body('scholarshipType')
    .notEmpty()
    .withMessage('Scholarship type is required')
    .isIn(['Merit', 'NeedBased', 'Sports', 'Cultural', 'Government', 'Private'])
    .withMessage('Invalid scholarship type'),
  
  body('academicYear')
    .notEmpty()
    .withMessage('Academic year is required')
    .isLength({ max: 10 })
    .withMessage('Academic year must be less than 10 characters'),
  
  body('benefitType')
    .notEmpty()
    .withMessage('Benefit type is required')
    .isIn(['FullTuitionWaiver', 'PartialTuitionWaiver', 'Stipend', 'FeeReduction'])
    .withMessage('Invalid benefit type'),
  
  body('totalSlots')
    .isInt({ min: 1 })
    .withMessage('Total slots must be a positive integer'),
  
  body('applicationStartDate')
    .notEmpty()
    .withMessage('Application start date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('applicationEndDate')
    .notEmpty()
    .withMessage('Application end date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

const applyForScholarshipValidator = [
  body('scholarshipId')
    .notEmpty()
    .withMessage('Scholarship ID is required'),
  
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required'),
  
  body('applicationDate')
    .notEmpty()
    .withMessage('Application date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('cgpa')
    .isNumeric()
    .withMessage('CGPA must be a number'),
  
  body('familyIncome')
    .isNumeric()
    .withMessage('Family income must be a number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['General', 'OBC', 'SC', 'ST', 'EWS'])
    .withMessage('Invalid category')
];

const getScholarshipApplicationsValidator = [
  param('scholarshipId')
    .notEmpty()
    .withMessage('Scholarship ID is required'),
  
  query('status')
    .optional()
    .isIn(['Pending', 'UnderReview', 'Approved', 'Rejected'])
    .withMessage('Invalid status')
];

const approveScholarshipApplicationValidator = [
  param('applicationId')
    .notEmpty()
    .withMessage('Application ID is required'),
  
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['Approve', 'Reject'])
    .withMessage('Invalid action'),
  
  body('approvedBy')
    .notEmpty()
    .withMessage('Approved by is required')
];

const disburseScholarshipValidator = [
  body('applicationId')
    .notEmpty()
    .withMessage('Application ID is required'),
  
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required'),
  
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  
  body('disbursementDate')
    .notEmpty()
    .withMessage('Disbursement date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('disbursementMode')
    .notEmpty()
    .withMessage('Disbursement mode is required')
    .isIn(['DirectFeeWaiver', 'BankTransfer', 'Cheque'])
    .withMessage('Invalid disbursement mode')
];

module.exports = {
  createFeeStructureValidator,
  updateFeeStructureValidator,
  getFeeStructuresValidator,
  getFeeStructureByIdValidator,
  generateFeeInvoiceValidator,
  getStudentInvoicesValidator,
  getInvoiceByIdValidator,
  recordFeePaymentValidator,
  getPaymentHistoryValidator,
  initiateRefundValidator,
  createScholarshipValidator,
  applyForScholarshipValidator,
  getScholarshipApplicationsValidator,
  approveScholarshipApplicationValidator,
  disburseScholarshipValidator
};