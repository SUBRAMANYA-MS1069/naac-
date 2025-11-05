const SalaryStructure = require('../../models/payroll/SalaryStructure');
const { calculateGrossSalary } = require('../../utils/calculators/salaryCalculator');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new salary structure
 * @param {Object} structureData - Salary structure data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created salary structure
 */
const createSalaryStructure = async (structureData, tenantId) => {
  try {
    // Add tenantId to structure data
    structureData.tenantId = tenantId;
    
    // Calculate CTC
    const totalEarnings = structureData.components.earnings.reduce((sum, component) => sum + (component.amount || 0), 0);
    structureData.ctc = totalEarnings;
    
    // Create salary structure
    const salaryStructure = new SalaryStructure(structureData);
    await salaryStructure.save();
    
    return salaryStructure;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Salary structure with this name already exists', 409, 'DUPLICATE_SALARY_STRUCTURE');
    }
    throw error;
  }
};

/**
 * Get salary structures with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Salary structures and pagination info
 */
const getSalaryStructures = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle active filter
    if (filters.active !== undefined) {
      query.isActive = filters.active;
    }
    
    // Handle designation filter
    if (filters.designation) {
      query.designation = filters.designation;
    }
    
    const salaryStructures = await SalaryStructure.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await SalaryStructure.countDocuments(query);
    
    return {
      salaryStructures,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch salary structures', 500, 'FETCH_SALARY_STRUCTURES_ERROR');
  }
};

/**
 * Get salary structure by ID
 * @param {String} structureId - Salary structure ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Salary structure
 */
const getSalaryStructureById = async (structureId, tenantId) => {
  try {
    const salaryStructure = await SalaryStructure.findOne({ salaryStructureId: structureId, tenantId });
    
    if (!salaryStructure) {
      throw new AppError('Salary structure not found', 404, 'SALARY_STRUCTURE_NOT_FOUND');
    }
    
    return salaryStructure;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid salary structure ID', 400, 'INVALID_SALARY_STRUCTURE_ID');
    }
    throw error;
  }
};

/**
 * Update salary structure
 * @param {String} structureId - Salary structure ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated salary structure
 */
const updateSalaryStructure = async (structureId, updateData, tenantId) => {
  try {
    // Recalculate CTC if components are updated
    if (updateData.components && updateData.components.earnings) {
      const totalEarnings = updateData.components.earnings.reduce((sum, component) => sum + (component.amount || 0), 0);
      updateData.ctc = totalEarnings;
    }
    
    const salaryStructure = await SalaryStructure.findOneAndUpdate(
      { salaryStructureId: structureId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!salaryStructure) {
      throw new AppError('Salary structure not found', 404, 'SALARY_STRUCTURE_NOT_FOUND');
    }
    
    return salaryStructure;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid salary structure ID', 400, 'INVALID_SALARY_STRUCTURE_ID');
    }
    throw error;
  }
};

/**
 * Delete salary structure (soft delete)
 * @param {String} structureId - Salary structure ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteSalaryStructure = async (structureId, tenantId) => {
  try {
    const salaryStructure = await SalaryStructure.findOneAndUpdate(
      { salaryStructureId: structureId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!salaryStructure) {
      throw new AppError('Salary structure not found', 404, 'SALARY_STRUCTURE_NOT_FOUND');
    }
    
    return {
      message: 'Salary structure deleted successfully',
      salaryStructure
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid salary structure ID', 400, 'INVALID_SALARY_STRUCTURE_ID');
    }
    throw error;
  }
};

/**
 * Calculate salary for an employee based on structure
 * @param {String} structureId - Salary structure ID
 * @param {Object} customComponents - Custom components for employee
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Calculated salary details
 */
const calculateSalary = async (structureId, customComponents = [], tenantId) => {
  try {
    const salaryStructure = await SalaryStructure.findOne({ salaryStructureId: structureId, tenantId });
    
    if (!salaryStructure) {
      throw new AppError('Salary structure not found', 404, 'SALARY_STRUCTURE_NOT_FOUND');
    }
    
    // Calculate earnings
    let totalEarnings = 0;
    const earningsBreakdown = [];
    
    // Add standard earnings
    for (const earning of salaryStructure.components.earnings) {
      const amount = earning.amount || 0;
      totalEarnings += amount;
      earningsBreakdown.push({
        componentName: earning.componentName,
        amount
      });
    }
    
    // Add custom earnings
    for (const custom of customComponents) {
      totalEarnings += custom.amount;
      earningsBreakdown.push({
        componentName: custom.componentName,
        amount: custom.amount
      });
    }
    
    // Calculate deductions
    let totalDeductions = 0;
    const deductionsBreakdown = [];
    
    for (const deduction of salaryStructure.components.deductions) {
      // In a real implementation, you would calculate actual deduction amounts
      // based on formulas or percentages
      const amount = deduction.amount || 0;
      totalDeductions += amount;
      deductionsBreakdown.push({
        componentName: deduction.componentName,
        amount
      });
    }
    
    const netSalary = totalEarnings - totalDeductions;
    
    return {
      grossSalary: totalEarnings,
      totalDeductions,
      netSalary,
      earningsBreakdown,
      deductionsBreakdown
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSalaryStructure,
  getSalaryStructures,
  getSalaryStructureById,
  updateSalaryStructure,
  deleteSalaryStructure,
  calculateSalary
};