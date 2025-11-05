const SalaryProcessing = require('../../models/payroll/SalaryProcessing');
const EmployeeSalary = require('../../models/payroll/EmployeeSalary');
const SalaryStructure = require('../../models/payroll/SalaryStructure');
const SalarySlip = require('../../models/payroll/SalarySlip');
const { AppError } = require('../../utils/helpers/errorHelper');
const { calculateGrossSalary, calculateTotalDeductions, calculateNetSalary } = require('../../utils/calculators/salaryCalculator');

/**
 * Process monthly salary
 * @param {Object} processingData - Salary processing data
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Salary processing batch
 */
const processMonthlySalary = async (processingData, tenantId, userId) => {
  try {
    // Add tenantId and processedBy to processing data
    processingData.tenantId = tenantId;
    processingData.processedBy = userId;
    processingData.status = 'Processing';
    
    // Create processing batch
    const salaryProcessing = new SalaryProcessing(processingData);
    await salaryProcessing.save();
    
    // In a real implementation, you would:
    // 1. Fetch employees based on filters
    // 2. Calculate salary for each employee
    // 3. Generate salary slips
    // 4. Update processing batch with totals
    
    // For now, we'll update with placeholder data
    salaryProcessing.totalEmployees = processingData.employeeIds?.length || 0;
    salaryProcessing.status = 'Completed';
    salaryProcessing.processedDate = new Date();
    
    await salaryProcessing.save();
    
    return salaryProcessing;
  } catch (error) {
    throw error;
  }
};

/**
 * Get salary processing batches with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Salary processing batches and pagination info
 */
const getSalaryProcessingBatches = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle status filter
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Handle date range filter
    if (filters.month && filters.year) {
      query.month = filters.month;
      query.year = filters.year;
    }
    
    const batches = await SalaryProcessing.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('processedBy', 'name email');
    
    const total = await SalaryProcessing.countDocuments(query);
    
    return {
      batches,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch salary processing batches', 500, 'FETCH_SALARY_BATCHES_ERROR');
  }
};

/**
 * Get salary processing batch by ID
 * @param {String} batchId - Batch ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Salary processing batch
 */
const getSalaryProcessingById = async (batchId, tenantId) => {
  try {
    const batch = await SalaryProcessing.findOne({ salaryProcessingId: batchId, tenantId })
      .populate('processedBy', 'name email');
    
    if (!batch) {
      throw new AppError('Salary processing batch not found', 404, 'SALARY_BATCH_NOT_FOUND');
    }
    
    return batch;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid batch ID', 400, 'INVALID_BATCH_ID');
    }
    throw error;
  }
};

/**
 * Generate salary slips for a batch
 * @param {String} batchId - Batch ID
 * @param {String} tenantId - Tenant ID
 * @returns {Array} Generated salary slips
 */
const generateSalarySlips = async (batchId, tenantId) => {
  try {
    const batch = await SalaryProcessing.findOne({ salaryProcessingId: batchId, tenantId });
    
    if (!batch) {
      throw new AppError('Salary processing batch not found', 404, 'SALARY_BATCH_NOT_FOUND');
    }
    
    if (batch.status !== 'Completed') {
      throw new AppError('Batch processing not completed', 400, 'BATCH_NOT_COMPLETED');
    }
    
    // In a real implementation, you would:
    // 1. Fetch employee salary data
    // 2. Calculate salary components
    // 3. Generate salary slips for each employee
    
    // For now, we'll return placeholder data
    const salarySlips = [];
    
    return salarySlips;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid batch ID', 400, 'INVALID_BATCH_ID');
    }
    throw error;
  }
};

/**
 * Disburse salary for a batch
 * @param {String} batchId - Batch ID
 * @param {Object} disbursementData - Disbursement data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated batch
 */
const disburseSalary = async (batchId, disbursementData, tenantId) => {
  try {
    const batch = await SalaryProcessing.findOne({ salaryProcessingId: batchId, tenantId });
    
    if (!batch) {
      throw new AppError('Salary processing batch not found', 404, 'SALARY_BATCH_NOT_FOUND');
    }
    
    if (batch.status !== 'Completed') {
      throw new AppError('Batch processing not completed', 400, 'BATCH_NOT_COMPLETED');
    }
    
    // Update disbursement details
    batch.disbursementDate = disbursementData.disbursementDate;
    batch.disbursementMode = disbursementData.disbursementMode;
    batch.bankAccountId = disbursementData.bankAccountId;
    batch.disbursementStatus = 'Initiated';
    
    await batch.save();
    
    return batch;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid batch ID', 400, 'INVALID_BATCH_ID');
    }
    throw error;
  }
};

/**
 * Get employee salary slip
 * @param {String} employeeId - Employee ID
 * @param {Number} month - Month
 * @param {Number} year - Year
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Salary slip
 */
const getEmployeeSalarySlip = async (employeeId, month, year, tenantId) => {
  try {
    const salarySlip = await SalarySlip.findOne({ 
      employeeId, 
      month, 
      year, 
      tenantId 
    });
    
    if (!salarySlip) {
      throw new AppError('Salary slip not found', 404, 'SALARY_SLIP_NOT_FOUND');
    }
    
    return salarySlip;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  processMonthlySalary,
  getSalaryProcessingBatches,
  getSalaryProcessingById,
  generateSalarySlips,
  disburseSalary,
  getEmployeeSalarySlip
};