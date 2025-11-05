const express = require('express');
const router = express.Router();

// Controllers
const gstController = require('../controllers/tax/gstController');
const tdsController = require('../controllers/tax/tdsController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, accountantOnly, auditorOnly } = require('../middleware/authorization.middleware');
const validate = require('../middleware/validation.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// GST Routes
router.post(
  '/gst-transactions',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Tax', 'GSTTransaction'),
  gstController.createGSTTransaction
);

router.get(
  '/gst-transactions',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Tax', 'GSTTransaction'),
  gstController.getGSTTransactions
);

router.get(
  '/gst-transactions/:transactionId',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Tax', 'GSTTransaction'),
  gstController.getGSTTransactionById
);

router.put(
  '/gst-transactions/:transactionId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Tax', 'GSTTransaction'),
  gstController.updateGSTTransaction
);

router.post(
  '/gst-transactions/:transactionId/gstr1-status',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Tax', 'GSTTransaction'),
  gstController.updateGSTR1FilingStatus
);

router.post(
  '/gst-transactions/:transactionId/gstr3b-status',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Tax', 'GSTTransaction'),
  gstController.updateGSTR3BFilingStatus
);

// TDS Routes
router.post(
  '/tds-deductions',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Tax', 'TDSDeduction'),
  tdsController.createTDSDeduction
);

router.get(
  '/tds-deductions',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Tax', 'TDSDeduction'),
  tdsController.getTDSDeductions
);

router.get(
  '/tds-deductions/:deductionId',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Tax', 'TDSDeduction'),
  tdsController.getTDSDeductionById
);

router.put(
  '/tds-deductions/:deductionId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Tax', 'TDSDeduction'),
  tdsController.updateTDSDeduction
);

router.post(
  '/tds-deductions/:deductionId/issue-certificate',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Tax', 'TDSDeduction'),
  tdsController.issueTDSCertificate
);

router.post(
  '/tds-deductions/:deductionId/form26q-status',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Tax', 'TDSDeduction'),
  tdsController.updateForm26QStatus
);

module.exports = router;