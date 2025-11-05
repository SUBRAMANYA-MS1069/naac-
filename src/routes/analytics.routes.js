const express = require('express');
const router = express.Router();

// Controllers
const financialRatiosController = require('../controllers/analytics/financialRatiosController');
const dashboardController = require('../controllers/analytics/dashboardController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, adminOnly } = require('../middleware/authorization.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Financial Ratios Routes
router.get(
  '/liquidity-ratios',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'LiquidityRatios'),
  financialRatiosController.getLiquidityRatios
);

router.get(
  '/profitability-ratios',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'ProfitabilityRatios'),
  financialRatiosController.getProfitabilityRatios
);

router.get(
  '/efficiency-ratios',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'EfficiencyRatios'),
  financialRatiosController.getEfficiencyRatios
);

router.get(
  '/leverage-ratios',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'LeverageRatios'),
  financialRatiosController.getLeverageRatios
);

router.get(
  '/comprehensive-analysis',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'ComprehensiveAnalysis'),
  financialRatiosController.getComprehensiveAnalysis
);

// Dashboard Routes
router.get(
  '/dashboard',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'FinancialDashboard'),
  dashboardController.getFinancialDashboard
);

router.get(
  '/budget-dashboard',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'BudgetDashboard'),
  dashboardController.getBudgetDashboard
);

router.get(
  '/receivables-dashboard',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'ReceivablesDashboard'),
  dashboardController.getReceivablesDashboard
);

router.get(
  '/payables-dashboard',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Analytics', 'PayablesDashboard'),
  dashboardController.getPayablesDashboard
);

module.exports = router;