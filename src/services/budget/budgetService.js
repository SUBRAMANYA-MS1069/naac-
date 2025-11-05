const Budget = require('../../models/budget/Budget');
const BudgetLine = require('../../models/budget/BudgetLine');
const { AppError } = require('../../utils/helpers/errorHelper');
const { calculateTotalBudget } = require('../../utils/calculators/budgetCalculator');

/**
 * Create a new budget
 * @param {Object} budgetData - Budget data
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Created budget
 */
const createBudget = async (budgetData, tenantId, userId) => {
  try {
    // Add tenantId and preparedBy to budget data
    budgetData.tenantId = tenantId;
    budgetData.preparedBy = userId;
    
    // Calculate totals from budget lines
    let totalIncome = 0;
    let totalExpense = 0;
    
    for (const line of budgetData.budgetLines) {
      const totalBudget = calculateTotalBudget(line.quarters);
      line.totalBudget = totalBudget;
      
      if (line.budgetCategory === 'Income') {
        totalIncome += totalBudget;
      } else {
        totalExpense += totalBudget;
      }
    }
    
    budgetData.totalIncome = totalIncome;
    budgetData.totalExpense = totalExpense;
    budgetData.netBudget = totalIncome - totalExpense;
    
    // Create budget
    const budget = new Budget(budgetData);
    await budget.save();
    
    // Create budget lines
    const budgetLines = budgetData.budgetLines.map(line => ({
      ...line,
      tenantId,
      budgetId: budget.budgetId
    }));
    
    await BudgetLine.insertMany(budgetLines);
    
    // Fetch budget with lines
    const budgetWithLines = await Budget.findOne({ budgetId: budget.budgetId, tenantId })
      .populate('budgetLines');
    
    return budgetWithLines;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Budget with this name already exists', 409, 'DUPLICATE_BUDGET_NAME');
    }
    throw error;
  }
};

/**
 * Get budgets with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Budgets and pagination info
 */
const getBudgets = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle status filter
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Handle financial year filter
    if (filters.financialYear) {
      query.financialYear = filters.financialYear;
    }
    
    const budgets = await Budget.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('preparedBy', 'name email');
    
    const total = await Budget.countDocuments(query);
    
    return {
      budgets,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch budgets', 500, 'FETCH_BUDGETS_ERROR');
  }
};

/**
 * Get budget by ID
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Budget
 */
const getBudgetById = async (budgetId, tenantId) => {
  try {
    const budget = await Budget.findOne({ budgetId, tenantId })
      .populate('preparedBy', 'name email')
      .populate('approvers', 'name email')
      .populate('approvedBy', 'name email');
    
    if (!budget) {
      throw new AppError('Budget not found', 404, 'BUDGET_NOT_FOUND');
    }
    
    // Get budget lines
    const budgetLines = await BudgetLine.find({ budgetId: budget.budgetId, tenantId });
    budget.budgetLines = budgetLines;
    
    return budget;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget ID', 400, 'INVALID_BUDGET_ID');
    }
    throw error;
  }
};

/**
 * Update budget
 * @param {String} budgetId - Budget ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated budget
 */
const updateBudget = async (budgetId, updateData, tenantId) => {
  try {
    // Prevent updating approved/closed budgets
    const existingBudget = await Budget.findOne({ budgetId, tenantId });
    
    if (!existingBudget) {
      throw new AppError('Budget not found', 404, 'BUDGET_NOT_FOUND');
    }
    
    if (['Approved', 'Closed'].includes(existingBudget.status)) {
      throw new AppError('Cannot update approved or closed budgets', 400, 'CANNOT_UPDATE_APPROVED_BUDGET');
    }
    
    const budget = await Budget.findOneAndUpdate(
      { budgetId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    return budget;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget ID', 400, 'INVALID_BUDGET_ID');
    }
    throw error;
  }
};

/**
 * Submit budget for approval
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Submitted budget
 */
const submitBudget = async (budgetId, tenantId, userId) => {
  try {
    const budget = await Budget.findOne({ budgetId, tenantId });
    
    if (!budget) {
      throw new AppError('Budget not found', 404, 'BUDGET_NOT_FOUND');
    }
    
    if (budget.status !== 'Draft') {
      throw new AppError('Only draft budgets can be submitted', 400, 'BUDGET_NOT_DRAFT');
    }
    
    budget.status = 'Submitted';
    budget.submittedBy = userId;
    budget.submittedDate = new Date();
    
    await budget.save();
    
    return budget;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget ID', 400, 'INVALID_BUDGET_ID');
    }
    throw error;
  }
};

/**
 * Approve budget
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Approved budget
 */
const approveBudget = async (budgetId, tenantId, userId) => {
  try {
    const budget = await Budget.findOne({ budgetId, tenantId });
    
    if (!budget) {
      throw new AppError('Budget not found', 404, 'BUDGET_NOT_FOUND');
    }
    
    if (budget.status !== 'Submitted') {
      throw new AppError('Only submitted budgets can be approved', 400, 'BUDGET_NOT_SUBMITTED');
    }
    
    budget.status = 'Approved';
    budget.approvedBy = userId;
    budget.approvedDate = new Date();
    
    await budget.save();
    
    return budget;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget ID', 400, 'INVALID_BUDGET_ID');
    }
    throw error;
  }
};

/**
 * Activate budget
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Activated budget
 */
const activateBudget = async (budgetId, tenantId) => {
  try {
    const budget = await Budget.findOne({ budgetId, tenantId });
    
    if (!budget) {
      throw new AppError('Budget not found', 404, 'BUDGET_NOT_FOUND');
    }
    
    if (budget.status !== 'Approved') {
      throw new AppError('Only approved budgets can be activated', 400, 'BUDGET_NOT_APPROVED');
    }
    
    budget.status = 'Active';
    budget.isCurrent = true;
    
    // Deactivate other budgets for the same financial year
    await Budget.updateMany(
      { 
        tenantId, 
        financialYear: budget.financialYear, 
        budgetId: { $ne: budgetId },
        isCurrent: true
      },
      { isCurrent: false }
    );
    
    await budget.save();
    
    return budget;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget ID', 400, 'INVALID_BUDGET_ID');
    }
    throw error;
  }
};

/**
 * Close budget
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @param {String} reason - Closure reason
 * @returns {Object} Closed budget
 */
const closeBudget = async (budgetId, tenantId, userId, reason) => {
  try {
    const budget = await Budget.findOne({ budgetId, tenantId });
    
    if (!budget) {
      throw new AppError('Budget not found', 404, 'BUDGET_NOT_FOUND');
    }
    
    budget.status = 'Closed';
    budget.closedBy = userId;
    budget.closedDate = new Date();
    budget.closureReason = reason;
    
    await budget.save();
    
    return budget;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget ID', 400, 'INVALID_BUDGET_ID');
    }
    throw error;
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  submitBudget,
  approveBudget,
  activateBudget,
  closeBudget
};