const express = require('express');
const router = express.Router();

// Controllers
const accountingSoftwareController = require('../controllers/integrations/accountingSoftwareController');
const bankingController = require('../controllers/integrations/bankingController');
const paymentGatewayController = require('../controllers/integrations/paymentGatewayController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, adminOnly } = require('../middleware/authorization.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Accounting Software Routes
router.post(
  '/accounting-software/sync',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Integrations', 'AccountingSoftware'),
  accountingSoftwareController.syncWithAccountingSoftware
);

router.get(
  '/accounting-software/status',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Integrations', 'AccountingSoftware'),
  accountingSoftwareController.getIntegrationStatus
);

router.post(
  '/accounting-software/configure',
  authMiddleware,
  adminOnly,
  tenantIsolation,
  auditLog('CREATE', 'Integrations', 'AccountingSoftware'),
  accountingSoftwareController.configureIntegration
);

router.post(
  '/accounting-software/export',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Integrations', 'AccountingSoftware'),
  accountingSoftwareController.exportToAccountingSoftware
);

// Banking Routes
router.get(
  '/banking/balances',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Integrations', 'Banking'),
  bankingController.getBankBalances
);

router.post(
  '/banking/sync-transactions',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Integrations', 'Banking'),
  bankingController.syncBankTransactions
);

router.get(
  '/banking/status',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Integrations', 'Banking'),
  bankingController.getBankIntegrationStatus
);

router.post(
  '/banking/configure',
  authMiddleware,
  adminOnly,
  tenantIsolation,
  auditLog('CREATE', 'Integrations', 'Banking'),
  bankingController.configureBankIntegration
);

// Payment Gateway Routes
router.get(
  '/payment-gateway/status',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Integrations', 'PaymentGateway'),
  paymentGatewayController.getPaymentGatewayStatus
);

router.post(
  '/payment-gateway/configure',
  authMiddleware,
  adminOnly,
  tenantIsolation,
  auditLog('CREATE', 'Integrations', 'PaymentGateway'),
  paymentGatewayController.configurePaymentGateway
);

router.get(
  '/payment-gateway/transactions',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Integrations', 'PaymentGateway'),
  paymentGatewayController.getPaymentTransactions
);

router.post(
  '/payment-gateway/refund',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Integrations', 'PaymentGateway'),
  paymentGatewayController.processRefund
);

module.exports = router;