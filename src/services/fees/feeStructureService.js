const FeeStructure = require('../../models/fees/FeeStructure');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new fee structure
 * @param {Object} feeStructureData - Fee structure data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created fee structure
 */
const createFeeStructure = async (feeStructureData, tenantId) => {
  try {
    // Add tenantId to fee structure data
    feeStructureData.tenantId = tenantId;
    
    // Calculate total fee
    const totalFee = feeStructureData.components.reduce((sum, component) => sum + component.amount, 0);
    feeStructureData.totalFee = totalFee;
    
    // Create fee structure
    const feeStructure = new FeeStructure(feeStructureData);
    await feeStructure.save();
    
    return feeStructure;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Fee structure with this name already exists', 409, 'DUPLICATE_FEE_STRUCTURE');
    }
    throw error;
  }
};

/**
 * Get fee structures with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Fee structures and pagination info
 */
const getFeeStructures = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle active filter
    if (filters.active !== undefined) {
      query.isActive = filters.active;
    }
    
    // Handle academic year filter
    if (filters.academicYear) {
      query.academicYear = filters.academicYear;
    }
    
    // Handle program filter
    if (filters.programId) {
      query.programId = filters.programId;
    }
    
    const feeStructures = await FeeStructure.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await FeeStructure.countDocuments(query);
    
    return {
      feeStructures,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch fee structures', 500, 'FETCH_FEE_STRUCTURES_ERROR');
  }
};

/**
 * Get fee structure by ID
 * @param {String} structureId - Fee structure ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Fee structure
 */
const getFeeStructureById = async (structureId, tenantId) => {
  try {
    const feeStructure = await FeeStructure.findOne({ feeStructureId: structureId, tenantId });
    
    if (!feeStructure) {
      throw new AppError('Fee structure not found', 404, 'FEE_STRUCTURE_NOT_FOUND');
    }
    
    return feeStructure;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid fee structure ID', 400, 'INVALID_FEE_STRUCTURE_ID');
    }
    throw error;
  }
};

/**
 * Update fee structure
 * @param {String} structureId - Fee structure ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated fee structure
 */
const updateFeeStructure = async (structureId, updateData, tenantId) => {
  try {
    // Recalculate total fee if components are updated
    if (updateData.components) {
      const totalFee = updateData.components.reduce((sum, component) => sum + component.amount, 0);
      updateData.totalFee = totalFee;
    }
    
    const feeStructure = await FeeStructure.findOneAndUpdate(
      { feeStructureId: structureId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!feeStructure) {
      throw new AppError('Fee structure not found', 404, 'FEE_STRUCTURE_NOT_FOUND');
    }
    
    return feeStructure;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid fee structure ID', 400, 'INVALID_FEE_STRUCTURE_ID');
    }
    throw error;
  }
};

/**
 * Delete fee structure (soft delete)
 * @param {String} structureId - Fee structure ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteFeeStructure = async (structureId, tenantId) => {
  try {
    const feeStructure = await FeeStructure.findOneAndUpdate(
      { feeStructureId: structureId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!feeStructure) {
      throw new AppError('Fee structure not found', 404, 'FEE_STRUCTURE_NOT_FOUND');
    }
    
    return {
      message: 'Fee structure deleted successfully',
      feeStructure
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid fee structure ID', 400, 'INVALID_FEE_STRUCTURE_ID');
    }
    throw error;
  }
};

/**
 * Get fee structure by program and academic year
 * @param {String} programId - Program ID
 * @param {String} academicYear - Academic year
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Fee structure
 */
const getFeeStructureByProgramAndYear = async (programId, academicYear, tenantId) => {
  try {
    const feeStructure = await FeeStructure.findOne({
      tenantId,
      programId,
      academicYear,
      isActive: true
    });
    
    if (!feeStructure) {
      throw new AppError('Fee structure not found for this program and academic year', 404, 'FEE_STRUCTURE_NOT_FOUND');
    }
    
    return feeStructure;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructureByProgramAndYear
};