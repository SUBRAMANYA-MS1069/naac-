const express = require('express');
const router = express.Router();

// Controllers
const financialStatementsController = require('../controllers/reports/financialStatementsController');
const managementReportsController = require('../controllers/reports/managementReportsController');
const auditReportsController = require('../controllers/reports/auditReportsController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, auditorOnly, adminOnly } = require('../middleware/authorization.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Financial Statements Routes
router.get(
  '/trial-balance',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'TrialBalance'),
  financialStatementsController.getTrialBalance
);

router.get(
  '/balance-sheet',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'BalanceSheet'),
  financialStatementsController.getBalanceSheet
);

router.get(
  '/income-statement',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'IncomeStatement'),
  financialStatementsController.getIncomeStatement
);

router.get(
  '/cash-flow',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'CashFlow'),
  financialStatementsController.getCashFlowStatement
);

router.get(
  '/export',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'FinancialStatementExport'),
  financialStatementsController.exportFinancialStatement
);

// Management Reports Routes
router.get(
  '/budget-vs-actual',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'BudgetVsActual'),
  managementReportsController.getBudgetVsActualReport
);

router.get(
  '/expense-analysis',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'ExpenseAnalysis'),
  managementReportsController.getExpenseAnalysisReport
);

router.get(
  '/revenue-analysis',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'RevenueAnalysis'),
  managementReportsController.getRevenueAnalysisReport
);

router.get(
  '/financial-ratios',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'FinancialRatios'),
  managementReportsController.getFinancialRatiosReport
);

router.get(
  '/management-export',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'ManagementReportExport'),
  managementReportsController.exportManagementReport
);

// Audit Reports Routes
router.get(
  '/audit-trail',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'AuditTrail'),
  auditReportsController.getTransactionAuditTrail
);

router.get(
  '/user-activity',
  authMiddleware,
  adminOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'UserActivity'),
  auditReportsController.getUserActivityLog
);

router.get(
  '/compliance',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Reports', 'ComplianceReport'),
  auditReportsController.getComplianceReport
);

router.post(
  '/generate-audit-report',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('CREATE', 'Reports', 'AuditReport'),
  auditReportsController.generateAuditReport
);

module.exports = router;