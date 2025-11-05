const salaryProcessingService = require('../../services/payroll/salaryProcessingService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Process monthly salary
 * @route POST /api/v1/finance/payroll/process-salary
 * @access Private (Finance Manager)
 */
const processMonthlySalary = async (req, res, next) => {
  try {
    const salaryProcessing = await salaryProcessingService.processMonthlySalary(req.body, req.tenantId, req.user.userId);
    res.status(201).json(successResponse(salaryProcessing, 'Salary processing initiated successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get salary processing batches
 * @route GET /api/v1/finance/payroll/salary-batches
 * @access Private (Finance Manager, HR)
 */
const getSalaryProcessingBatches = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      status: req.query.status,
      month: req.query.month,
      year: req.query.year
    };
    
    const result = await salaryProcessingService.getSalaryProcessingBatches(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.batches,
      result.page,
      result.limit,
      result.total,
      'Salary processing batches retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get salary processing batch by ID
 * @route GET /api/v1/finance/payroll/salary-batches/:batchId
 * @access Private (Finance Manager, HR)
 */
const getSalaryProcessingById = async (req, res, next) => {
  try {
    const batch = await salaryProcessingService.getSalaryProcessingById(req.params.batchId, req.tenantId);
    res.json(successResponse(batch, 'Salary processing batch retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Generate salary slips for a batch
 * @route POST /api/v1/finance/payroll/salary-batches/:batchId/generate-slips
 * @access Private (Finance Manager)
 */
const generateSalarySlips = async (req, res, next) => {
  try {
    const salarySlips = await salaryProcessingService.generateSalarySlips(req.params.batchId, req.tenantId);
    res.status(201).json(successResponse(salarySlips, 'Salary slips generated successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get employee salary slip
 * @route GET /api/v1/finance/payroll/salary-slips/:employeeId
 * @access Private (Employee, Finance Manager, HR)
 */
const getEmployeeSalarySlip = async (req, res, next) => {
  try {
    const salarySlip = await salaryProcessingService.getEmployeeSalarySlip(
      req.params.employeeId,
      req.query.month,
      req.query.year,
      req.tenantId
    );
    res.json(successResponse(salarySlip, 'Salary slip retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Disburse salary
 * @route POST /api/v1/finance/payroll/salary-batches/:batchId/disburse
 * @access Private (Finance Manager)
 */
const disburseSalary = async (req, res, next) => {
  try {
    const result = await salaryProcessingService.disburseSalary(
      req.params.batchId,
      req.body,
      req.tenantId
    );
    res.json(successResponse(result, 'Salary disbursed successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processMonthlySalary,
  getSalaryProcessingBatches,
  getSalaryProcessingById,
  generateSalarySlips,
  getEmployeeSalarySlip,
  disburseSalary
};