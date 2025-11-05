const tdsService = require('../../services/tax/tdsService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new TDS deduction
 * @route POST /api/v1/finance/tax/tds-deductions
 * @access Private (Finance Manager, Accountant)
 */
const createTDSDeduction = async (req, res, next) => {
  try {
    const tdsDeduction = await tdsService.createTDSDeduction(req.body, req.tenantId);
    res.status(201).json(successResponse(tdsDeduction, 'TDS deduction created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all TDS deductions
 * @route GET /api/v1/finance/tax/tds-deductions
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getTDSDeductions = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      section: req.query.section,
      financialYear: req.query.financialYear,
      quarter: req.query.quarter,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await tdsService.getTDSDeductions(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.deductions,
      result.page,
      result.limit,
      result.total,
      'TDS deductions retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get TDS deduction by ID
 * @route GET /api/v1/finance/tax/tds-deductions/:deductionId
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getTDSDeductionById = async (req, res, next) => {
  try {
    const deduction = await tdsService.getTDSDeductionById(req.params.deductionId, req.tenantId);
    res.json(successResponse(deduction, 'TDS deduction retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update TDS deduction
 * @route PUT /api/v1/finance/tax/tds-deductions/:deductionId
 * @access Private (Finance Manager, Accountant)
 */
const updateTDSDeduction = async (req, res, next) => {
  try {
    const deduction = await tdsService.updateTDSDeduction(req.params.deductionId, req.body, req.tenantId);
    res.json(successResponse(deduction, 'TDS deduction updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Issue TDS certificate
 * @route POST /api/v1/finance/tax/tds-deductions/:deductionId/issue-certificate
 * @access Private (Finance Manager)
 */
const issueTDSCertificate = async (req, res, next) => {
  try {
    const deduction = await tdsService.issueTDSCertificate(
      req.params.deductionId,
      req.body.certificateIssueDate,
      req.tenantId
    );
    res.json(successResponse(deduction, 'TDS certificate issued successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update Form 26Q status
 * @route POST /api/v1/finance/tax/tds-deductions/:deductionId/form26q-status
 * @access Private (Finance Manager)
 */
const updateForm26QStatus = async (req, res, next) => {
  try {
    const deduction = await tdsService.updateForm26QStatus(
      req.params.deductionId,
      req.body.status,
      req.body.filingDate,
      req.tenantId
    );
    res.json(successResponse(deduction, 'Form 26Q status updated successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTDSDeduction,
  getTDSDeductions,
  getTDSDeductionById,
  updateTDSDeduction,
  issueTDSCertificate,
  updateForm26QStatus
};