const express = require('express');
const router = express.Router();

// Controllers
const feeStructureController = require('../controllers/fees/feeStructureController');
const feeCollectionController = require('../controllers/fees/feeCollectionController');
const scholarshipController = require('../controllers/fees/scholarshipController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, accountantOnly, studentOnly } = require('../middleware/authorization.middleware');
const validate = require('../middleware/validation.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Validators
const {
  createFeeStructureValidator,
  updateFeeStructureValidator,
  getFeeStructuresValidator,
  getFeeStructureByIdValidator
} = require('../utils/validators/feeValidator');

const {
  generateFeeInvoiceValidator,
  getStudentInvoicesValidator,
  getInvoiceByIdValidator,
  updateInvoiceValidator
} = require('../utils/validators/feeValidator');

// Fee Structure Routes
router.post(
  '/structures',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  createFeeStructureValidator,
  validate,
  auditLog('CREATE', 'Fees', 'FeeStructure'),
  feeStructureController.createFeeStructure
);

router.get(
  '/structures',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getFeeStructuresValidator,
  validate,
  auditLog('READ', 'Fees', 'FeeStructure'),
  feeStructureController.getFeeStructures
);

router.get(
  '/structures/:structureId',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getFeeStructureByIdValidator,
  validate,
  auditLog('READ', 'Fees', 'FeeStructure'),
  feeStructureController.getFeeStructureById
);

router.put(
  '/structures/:structureId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  updateFeeStructureValidator,
  validate,
  auditLog('UPDATE', 'Fees', 'FeeStructure'),
  feeStructureController.updateFeeStructure
);

router.delete(
  '/structures/:structureId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('DELETE', 'Fees', 'FeeStructure'),
  feeStructureController.deleteFeeStructure
);

// Fee Collection Routes
router.post(
  '/invoices',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  generateFeeInvoiceValidator,
  validate,
  auditLog('CREATE', 'Fees', 'FeeInvoice'),
  feeCollectionController.generateInvoice
);

router.get(
  '/invoices',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  auditLog('READ', 'Fees', 'FeeInvoice'),
  feeCollectionController.getInvoices
);

router.get(
  '/invoices/:invoiceId',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getInvoiceByIdValidator,
  validate,
  auditLog('READ', 'Fees', 'FeeInvoice'),
  feeCollectionController.getInvoiceById
);

router.put(
  '/invoices/:invoiceId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  updateInvoiceValidator,
  validate,
  auditLog('UPDATE', 'Fees', 'FeeInvoice'),
  feeCollectionController.updateInvoice
);

router.post(
  '/payments',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Fees', 'FeePayment'),
  feeCollectionController.recordPayment
);

router.get(
  '/payments',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Fees', 'FeePayment'),
  feeCollectionController.getPayments
);

router.get(
  '/payments/:paymentId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Fees', 'FeePayment'),
  feeCollectionController.getPaymentById
);

// Scholarship Routes
router.post(
  '/scholarships',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Fees', 'Scholarship'),
  scholarshipController.createScholarship
);

router.get(
  '/scholarships',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Fees', 'Scholarship'),
  scholarshipController.getScholarships
);

router.get(
  '/scholarships/:scholarshipId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Fees', 'Scholarship'),
  scholarshipController.getScholarshipById
);

router.put(
  '/scholarships/:scholarshipId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Fees', 'Scholarship'),
  scholarshipController.updateScholarship
);

router.delete(
  '/scholarships/:scholarshipId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('DELETE', 'Fees', 'Scholarship'),
  scholarshipController.deleteScholarship
);

router.post(
  '/scholarships/:scholarshipId/applications',
  authMiddleware,
  studentOnly,
  tenantIsolation,
  auditLog('CREATE', 'Fees', 'ScholarshipApplication'),
  scholarshipController.applyForScholarship
);

router.get(
  '/scholarships/:scholarshipId/applications',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Fees', 'ScholarshipApplication'),
  scholarshipController.getScholarshipApplications
);

router.put(
  '/scholarships/applications/:applicationId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Fees', 'ScholarshipApplication'),
  scholarshipController.updateScholarshipApplication
);

router.delete(
  '/scholarships/applications/:applicationId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('DELETE', 'Fees', 'ScholarshipApplication'),
  scholarshipController.deleteScholarshipApplication
);

module.exports = router;