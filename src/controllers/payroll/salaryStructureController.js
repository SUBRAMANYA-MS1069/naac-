const salaryStructureService = require('../../services/payroll/salaryStructureService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new salary structure
 * @route POST /api/v1/finance/payroll/salary-structures
 * @access Private (Finance Manager, HR)
 */
const createSalaryStructure = async (req, res, next) => {
  try {
    const salaryStructure = await salaryStructureService.createSalaryStructure(req.body, req.tenantId);
    res.status(201).json(successResponse(salaryStructure, 'Salary structure created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all salary structures
 * @route GET /api/v1/finance/payroll/salary-structures
 * @access Private (Finance Manager, HR)
 */
const getSalaryStructures = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      active: req.query.active,
      designation: req.query.designation
    };
    
    const result = await salaryStructureService.getSalaryStructures(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.salaryStructures,
      result.page,
      result.limit,
      result.total,
      'Salary structures retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get salary structure by ID
 * @route GET /api/v1/finance/payroll/salary-structures/:structureId
 * @access Private (Finance Manager, HR)
 */
const getSalaryStructureById = async (req, res, next) => {
  try {
    const salaryStructure = await salaryStructureService.getSalaryStructureById(req.params.structureId, req.tenantId);
    res.json(successResponse(salaryStructure, 'Salary structure retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update salary structure
 * @route PUT /api/v1/finance/payroll/salary-structures/:structureId
 * @access Private (Finance Manager, HR)
 */
const updateSalaryStructure = async (req, res, next) => {
  try {
    const salaryStructure = await salaryStructureService.updateSalaryStructure(req.params.structureId, req.body, req.tenantId);
    res.json(successResponse(salaryStructure, 'Salary structure updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete salary structure
 * @route DELETE /api/v1/finance/payroll/salary-structures/:structureId
 * @access Private (Finance Manager, HR)
 */
const deleteSalaryStructure = async (req, res, next) => {
  try {
    const result = await salaryStructureService.deleteSalaryStructure(req.params.structureId, req.tenantId);
    res.json(successResponse(result, 'Salary structure deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSalaryStructure,
  getSalaryStructures,
  getSalaryStructureById,
  updateSalaryStructure,
  deleteSalaryStructure
};