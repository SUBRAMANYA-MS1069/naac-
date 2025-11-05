
const express = require('express');
const router = express.Router();


// Controllers
const budgetController = require('../controllers/budget/budgetController');
const budgetMonitoringController = require('../controllers/budget/budgetMonitoringController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, adminOnly, auditorOnly } = require('../middleware/authorization.middleware');
const validate = require('../middleware/validation.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Validators
const {
  createBudgetValidator,
  updateBudgetValidator,
  getBudgetsValidator,
  getBudgetByIdValidator,
  submitBudgetValidator,
  approveBudgetValidator,
  activateBudgetValidator,
  closeBudgetValidator
} = require('../utils/validators/budgetValidator');
console.log('=== DEBUG MIDDLEWARE ===');
console.log('authMiddleware:', typeof authMiddleware);
console.log('financeManagerOnly:', typeof financeManagerOnly);
console.log('adminOnly:', typeof adminOnly);
console.log('auditorOnly:', typeof auditorOnly);
console.log('tenantIsolation:', typeof tenantIsolation);
console.log('auditLog:', typeof auditLog);
console.log('validate:', typeof validate);
console.log('budgetController:', budgetController);
console.log('budgetMonitoringController:', budgetMonitoringController);
console.log('=== END DEBUG ===');


// Budget Routes
router.post(
  '/budgets',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  createBudgetValidator,
  validate,
  auditLog('CREATE', 'Budget', 'Budget'),
  budgetController.createBudget
);

router.get(
  '/budgets',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  getBudgetsValidator,
  validate,
  auditLog('READ', 'Budget', 'Budget'),
  budgetController.getBudgets
);

router.get(
  '/budgets/:budgetId',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  getBudgetByIdValidator,
  validate,
  auditLog('READ', 'Budget', 'Budget'),
  budgetController.getBudgetById
);

router.put(
  '/budgets/:budgetId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  updateBudgetValidator,
  validate,
  auditLog('UPDATE', 'Budget', 'Budget'),
  budgetController.updateBudget
);

router.post(
  '/budgets/:budgetId/submit',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  submitBudgetValidator,
  validate,
  auditLog('UPDATE', 'Budget', 'Budget'),
  budgetController.submitBudget
);

router.post(
  '/budgets/:budgetId/approve',
  authMiddleware,
  adminOnly,
  tenantIsolation,
  approveBudgetValidator,
  validate,
  auditLog('UPDATE', 'Budget', 'Budget'),
  budgetController.approveBudget
);

router.post(
  '/budgets/:budgetId/activate',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  activateBudgetValidator,
  validate,
  auditLog('UPDATE', 'Budget', 'Budget'),
  budgetController.activateBudget
);

router.post(
  '/budgets/:budgetId/close',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  closeBudgetValidator,
  validate,
  auditLog('UPDATE', 'Budget', 'Budget'),
  budgetController.closeBudget
);

// Budget Monitoring Routes
router.get(
  '/budgets/:budgetId/actuals',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Budget', 'BudgetActuals'),
  budgetMonitoringController.getBudgetVsActuals
);

router.get(
  '/budgets/:budgetId/quarterly-utilization',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Budget', 'QuarterlyUtilization'),
  budgetMonitoringController.getQuarterlyUtilization
);

router.get(
  '/budgets/:budgetId/summary',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Budget', 'BudgetSummary'),
  budgetMonitoringController.getBudgetSummary
);

router.post(
  '/budgets/:budgetId/alerts',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Budget', 'BudgetAlert'),
  budgetMonitoringController.createBudgetAlert
);

router.get(
  '/budgets/:budgetId/alerts',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Budget', 'BudgetAlert'),
  budgetMonitoringController.getBudgetAlerts
);

router.put(
  '/budgets/alerts/:alertId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Budget', 'BudgetAlert'),
  budgetMonitoringController.updateBudgetAlert
);

router.delete(
  '/budgets/alerts/:alertId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('DELETE', 'Budget', 'BudgetAlert'),
  budgetMonitoringController.deleteBudgetAlert
);

router.post(
  '/budgets/:budgetId/check-thresholds',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Budget', 'BudgetThresholds'),
  budgetMonitoringController.checkBudgetThresholds
);

module.exports = router;