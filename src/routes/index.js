const express = require('express');
const router = express.Router();

// Import all route modules
const financeRoutes = require('./finance.routes');
const budgetRoutes = require('./budget.routes');
const feesRoutes = require('./fees.routes');
const expenditureRoutes = require('./expenditure.routes');
const payrollRoutes = require('./payroll.routes');
const taxRoutes = require('./tax.routes');
const reportsRoutes = require('./reports.routes');
const analyticsRoutes = require('./analytics.routes');
const integrationsRoutes = require('./integrations.routes');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');

// Apply middleware to all routes
router.use(authMiddleware);
router.use(tenantIsolation);

// Register all route modules
router.use('/finance', financeRoutes);
router.use('/budgets', budgetRoutes);
router.use('/fees', feesRoutes);
router.use('/expenditure', expenditureRoutes);
router.use('/payroll', payrollRoutes);
router.use('/tax', taxRoutes);
router.use('/reports', reportsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/integrations', integrationsRoutes);

module.exports = router;