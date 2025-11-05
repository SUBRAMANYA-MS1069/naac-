const express = require('express');
const router = express.Router();

// Controllers
const salaryStructureController = require('../controllers/payroll/salaryStructureController');
const salaryProcessingController = require('../controllers/payroll/salaryProcessingController');
const payrollComplianceController = require('../controllers/payroll/payrollComplianceController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, hrOnly, adminOnly, employeeOnly } = require('../middleware/authorization.middleware');
const validate = require('../middleware/validation.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Salary Structure Routes
router.post(
  '/salary-structures',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Payroll', 'SalaryStructure'),
  salaryStructureController.createSalaryStructure
);

router.get(
  '/salary-structures',
  authMiddleware,
  hrOnly,
  tenantIsolation,
  auditLog('READ', 'Payroll', 'SalaryStructure'),
  salaryStructureController.getSalaryStructures
);

router.get(
  '/salary-structures/:structureId',
  authMiddleware,
  hrOnly,
  tenantIsolation,
  auditLog('READ', 'Payroll', 'SalaryStructure'),
  salaryStructureController.getSalaryStructureById
);

router.put(
  '/salary-structures/:structureId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Payroll', 'SalaryStructure'),
  salaryStructureController.updateSalaryStructure
);

router.delete(
  '/salary-structures/:structureId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('DELETE', 'Payroll', 'SalaryStructure'),
  salaryStructureController.deleteSalaryStructure
);

// Salary Processing Routes
router.post(
  '/process-salary',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Payroll', 'SalaryProcessing'),
  salaryProcessingController.processMonthlySalary
);

router.get(
  '/salary-batches',
  authMiddleware,
  hrOnly,
  tenantIsolation,
  auditLog('READ', 'Payroll', 'SalaryProcessing'),
  salaryProcessingController.getSalaryProcessingBatches
);

router.get(
  '/salary-batches/:batchId',
  authMiddleware,
  hrOnly,
  tenantIsolation,
  auditLog('READ', 'Payroll', 'SalaryProcessing'),
  salaryProcessingController.getSalaryProcessingById
);

router.post(
  '/salary-batches/:batchId/generate-slips',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Payroll', 'SalarySlip'),
  salaryProcessingController.generateSalarySlips
);

router.get(
  '/salary-slips/:employeeId',
  authMiddleware,
  employeeOnly,
  tenantIsolation,
  auditLog('READ', 'Payroll', 'SalarySlip'),
  salaryProcessingController.getEmployeeSalarySlip
);

router.post(
  '/salary-batches/:batchId/disburse',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Payroll', 'SalaryProcessing'),
  salaryProcessingController.disburseSalary
);

// Payroll Compliance Routes
router.get(
  '/compliance',
  authMiddleware,
  hrOnly,
  tenantIsolation,
  auditLog('READ', 'Payroll', 'Compliance'),
  payrollComplianceController.getComplianceRecords
);

router.put(
  '/compliance/:complianceId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('UPDATE', 'Payroll', 'Compliance'),
  payrollComplianceController.updateComplianceStatus
);

router.post(
  '/compliance/generate-form16',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  auditLog('CREATE', 'Payroll', 'Form16'),
  payrollComplianceController.generateForm16
);

module.exports = router;