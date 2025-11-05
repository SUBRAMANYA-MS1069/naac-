const feeStructureService = require('../../services/fees/feeStructureService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new fee structure
 * @route POST /api/v1/finance/fees/structures
 * @access Private (Finance Manager)
 */
const createFeeStructure = async (req, res, next) => {
  try {
    const feeStructure = await feeStructureService.createFeeStructure(req.body, req.tenantId);
    res.status(201).json(successResponse(feeStructure, 'Fee structure created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all fee structures
 * @route GET /api/v1/finance/fees/structures
 * @access Private (Finance Manager, Accountant)
 */
const getFeeStructures = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      active: req.query.active,
      academicYear: req.query.academicYear,
      programId: req.query.programId
    };
    
    const result = await feeStructureService.getFeeStructures(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.feeStructures,
      result.page,
      result.limit,
      result.total,
      'Fee structures retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get fee structure by ID
 * @route GET /api/v1/finance/fees/structures/:structureId
 * @access Private (Finance Manager, Accountant)
 */
const getFeeStructureById = async (req, res, next) => {
  try {
    const feeStructure = await feeStructureService.getFeeStructureById(req.params.structureId, req.tenantId);
    res.json(successResponse(feeStructure, 'Fee structure retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update fee structure
 * @route PUT /api/v1/finance/fees/structures/:structureId
 * @access Private (Finance Manager)
 */
const updateFeeStructure = async (req, res, next) => {
  try {
    const feeStructure = await feeStructureService.updateFeeStructure(req.params.structureId, req.body, req.tenantId);
    res.json(successResponse(feeStructure, 'Fee structure updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete fee structure
 * @route DELETE /api/v1/finance/fees/structures/:structureId
 * @access Private (Finance Manager)
 */
const deleteFeeStructure = async (req, res, next) => {
  try {
    const result = await feeStructureService.deleteFeeStructure(req.params.structureId, req.tenantId);
    res.json(successResponse(result, 'Fee structure deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure
};