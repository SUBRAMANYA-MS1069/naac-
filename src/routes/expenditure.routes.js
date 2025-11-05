const express = require('express');
const router = express.Router();

// Controllers
const purchaseOrderController = require('../controllers/expenditure/purchaseOrderController');
const vendorController = require('../controllers/expenditure/vendorController');
const billController = require('../controllers/expenditure/billController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, adminOnly, accountantOnly } = require('../middleware/authorization.middleware');
const validate = require('../middleware/validation.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Purchase Order Routes
router.post(
  '/purchase-orders',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Expenditure', 'PurchaseOrder'),
  purchaseOrderController.createPurchaseOrder
);

router.get(
  '/purchase-orders',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  auditLog('READ', 'Expenditure', 'PurchaseOrder'),
  purchaseOrderController.getPurchaseOrders
);

router.get(
  '/purchase-orders/:poId',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  auditLog('READ', 'Expenditure', 'PurchaseOrder'),
  purchaseOrderController.getPurchaseOrderById
);

router.put(
  '/purchase-orders/:poId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Expenditure', 'PurchaseOrder'),
  purchaseOrderController.updatePurchaseOrder
);

router.post(
  '/purchase-orders/:poId/approve',
  authMiddleware,
  adminOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Expenditure', 'PurchaseOrder'),
  purchaseOrderController.approvePurchaseOrder
);

router.post(
  '/purchase-orders/:poId/close',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Expenditure', 'PurchaseOrder'),
  purchaseOrderController.closePurchaseOrder
);

// Vendor Routes
router.post(
  '/vendors',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Expenditure', 'Vendor'),
  vendorController.createVendor
);

router.get(
  '/vendors',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Expenditure', 'Vendor'),
  vendorController.getVendors
);

router.get(
  '/vendors/:vendorId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('READ', 'Expenditure', 'Vendor'),
  vendorController.getVendorById
);

router.put(
  '/vendors/:vendorId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Expenditure', 'Vendor'),
  vendorController.updateVendor
);

router.delete(
  '/vendors/:vendorId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('DELETE', 'Expenditure', 'Vendor'),
  vendorController.deleteVendor
);

// Bill Routes
router.post(
  '/bills',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Expenditure', 'Bill'),
  billController.createBill
);

router.get(
  '/bills',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  auditLog('READ', 'Expenditure', 'Bill'),
  billController.getBills
);

router.get(
  '/bills/:billId',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  auditLog('READ', 'Expenditure', 'Bill'),
  billController.getBillById
);

router.put(
  '/bills/:billId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Expenditure', 'Bill'),
  billController.updateBill
);

router.post(
  '/bills/:billId/approve',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Expenditure', 'Bill'),
  billController.approveBill
);

router.post(
  '/bills/:billId/pay',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Expenditure', 'BillPayment'),
  billController.recordBillPayment
);

module.exports = router;