const TDSDeduction = require('../../models/tax/TDSDeduction');
const { calculateTDS } = require('../../utils/calculators/taxCalculator');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new TDS deduction
 * @param {Object} tdsData - TDS deduction data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created TDS deduction
 */
const createTDSDeduction = async (tdsData, tenantId) => {
  try {
    // Add tenantId to TDS data
    tdsData.tenantId = tenantId;
    
    // Calculate TDS amounts
    const tdsCalculation = calculateTDS(tdsData.grossAmount, tdsData.tdsRate);
    
    tdsData.tdsAmount = tdsCalculation.tdsAmount;
    tdsData.netAmount = tdsCalculation.netAmount;
    
    // Create TDS deduction
    const tdsDeduction = new TDSDeduction(tdsData);
    await tdsDeduction.save();
    
    return tdsDeduction;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('TDS deduction with this details already exists', 409, 'DUPLICATE_TDS_DEDUCTION');
    }
    throw error;
  }
};

/**
 * Get TDS deductions with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} TDS deductions and pagination info
 */
const getTDSDeductions = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle section filter
    if (filters.section) {
      query.section = filters.section;
    }
    
    // Handle financial year filter
    if (filters.financialYear) {
      query.financialYear = filters.financialYear;
    }
    
    // Handle quarter filter
    if (filters.quarter) {
      query.quarter = filters.quarter;
    }
    
    // Handle date range filter
    if (filters.startDate || filters.endDate) {
      query.paymentDate = {};
      if (filters.startDate) {
        query.paymentDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.paymentDate.$lte = new Date(filters.endDate);
      }
    }
    
    const deductions = await TDSDeduction.find(query)
      .sort(pagination.sort || '-paymentDate')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await TDSDeduction.countDocuments(query);
    
    return {
      deductions,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch TDS deductions', 500, 'FETCH_TDS_DEDUCTIONS_ERROR');
  }
};

/**
 * Get TDS deduction by ID
 * @param {String} deductionId - Deduction ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} TDS deduction
 */
const getTDSDeductionById = async (deductionId, tenantId) => {
  try {
    const deduction = await TDSDeduction.findOne({ tdsDeductionId: deductionId, tenantId });
    
    if (!deduction) {
      throw new AppError('TDS deduction not found', 404, 'TDS_DEDUCTION_NOT_FOUND');
    }
    
    return deduction;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid TDS deduction ID', 400, 'INVALID_TDS_DEDUCTION_ID');
    }
    throw error;
  }
};

/**
 * Update TDS deduction
 * @param {String} deductionId - Deduction ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated TDS deduction
 */
const updateTDSDeduction = async (deductionId, updateData, tenantId) => {
  try {
    // Recalculate TDS if gross amount or rate is updated
    if (updateData.grossAmount !== undefined || updateData.tdsRate !== undefined) {
      const grossAmount = updateData.grossAmount || (await TDSDeduction.findOne({ tdsDeductionId: deductionId, tenantId }))?.grossAmount;
      const tdsRate = updateData.tdsRate || (await TDSDeduction.findOne({ tdsDeductionId: deductionId, tenantId }))?.tdsRate;
      
      const tdsCalculation = calculateTDS(grossAmount, tdsRate);
      
      updateData.tdsAmount = tdsCalculation.tdsAmount;
      updateData.netAmount = tdsCalculation.netAmount;
    }
    
    const deduction = await TDSDeduction.findOneAndUpdate(
      { tdsDeductionId: deductionId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!deduction) {
      throw new AppError('TDS deduction not found', 404, 'TDS_DEDUCTION_NOT_FOUND');
    }
    
    return deduction;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid TDS deduction ID', 400, 'INVALID_TDS_DEDUCTION_ID');
    }
    throw error;
  }
};

/**
 * Delete TDS deduction (soft delete)
 * @param {String} deductionId - Deduction ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteTDSDeduction = async (deductionId, tenantId) => {
  try {
    const deduction = await TDSDeduction.findOneAndUpdate(
      { tdsDeductionId: deductionId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!deduction) {
      throw new AppError('TDS deduction not found', 404, 'TDS_DEDUCTION_NOT_FOUND');
    }
    
    return {
      message: 'TDS deduction deleted successfully',
      deduction
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid TDS deduction ID', 400, 'INVALID_TDS_DEDUCTION_ID');
    }
    throw error;
  }
};

/**
 * Get TDS summary by financial year
 * @param {String} financialYear - Financial year
 * @param {String} tenantId - Tenant ID
 * @returns {Object} TDS summary
 */
const getTDSSummary = async (financialYear, tenantId) => {
  try {
    const deductions = await TDSDeduction.find({ 
      tenantId, 
      financialYear,
      isActive: true
    });
    
    const totalGrossAmount = deductions.reduce((sum, d) => sum + d.grossAmount, 0);
    const totalTDSDeducted = deductions.reduce((sum, d) => sum + d.tdsAmount, 0);
    const totalNetAmount = deductions.reduce((sum, d) => sum + d.netAmount, 0);
    
    // Group by section
    const sectionWise = {};
    deductions.forEach(deduction => {
      if (!sectionWise[deduction.section]) {
        sectionWise[deduction.section] = {
          count: 0,
          grossAmount: 0,
          tdsAmount: 0,
          netAmount: 0
        };
      }
      
      sectionWise[deduction.section].count++;
      sectionWise[deduction.section].grossAmount += deduction.grossAmount;
      sectionWise[deduction.section].tdsAmount += deduction.tdsAmount;
      sectionWise[deduction.section].netAmount += deduction.netAmount;
    });
    
    return {
      financialYear,
      totalDeductions: deductions.length,
      totalGrossAmount,
      totalTDSDeducted,
      totalNetAmount,
      sectionWise
    };
  } catch (error) {
    throw new AppError('Failed to get TDS summary', 500, 'TDS_SUMMARY_ERROR');
  }
};

module.exports = {
  createTDSDeduction,
  getTDSDeductions,
  getTDSDeductionById,
  updateTDSDeduction,
  deleteTDSDeduction,
  getTDSSummary
};