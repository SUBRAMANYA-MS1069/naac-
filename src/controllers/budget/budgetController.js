const budgetService = require('../../services/budget/budgetService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new budget
 * @route POST /api/v1/finance/budgets
 * @access Private (Finance Manager)
 */
const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.body, req.tenantId, req.user.userId);
    res.status(201).json(successResponse(budget, 'Budget created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all budgets
 * @route GET /api/v1/finance/budgets
 * @access Private (Finance Manager, Auditor)
 */
const getBudgets = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      status: req.query.status,
      financialYear: req.query.financialYear
    };
    
    const result = await budgetService.getBudgets(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.budgets,
      result.page,
      result.limit,
      result.total,
      'Budgets retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get budget by ID
 * @route GET /api/v1/finance/budgets/:budgetId
 * @access Private (Finance Manager, Auditor)
 */
const getBudgetById = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.params.budgetId, req.tenantId);
    res.json(successResponse(budget, 'Budget retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update budget
 * @route PUT /api/v1/finance/budgets/:budgetId
 * @access Private (Finance Manager)
 */
const updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(req.params.budgetId, req.body, req.tenantId);
    res.json(successResponse(budget, 'Budget updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Submit budget for approval
 * @route POST /api/v1/finance/budgets/:budgetId/submit
 * @access Private (Finance Manager)
 */
const submitBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.submitBudget(
      req.params.budgetId,
      req.body.submittedBy,
      req.body.submittedDate,
      req.tenantId
    );
    res.json(successResponse(budget, 'Budget submitted for approval successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Approve budget
 * @route POST /api/v1/finance/budgets/:budgetId/approve
 * @access Private (Admin, Finance Manager)
 */
const approveBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.approveBudget(
      req.params.budgetId,
      req.body.approvedBy,
      req.body.approvedDate,
      req.tenantId
    );
    res.json(successResponse(budget, 'Budget approved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Activate budget
 * @route POST /api/v1/finance/budgets/:budgetId/activate
 * @access Private (Finance Manager)
 */
const activateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.activateBudget(req.params.budgetId, req.tenantId);
    res.json(successResponse(budget, 'Budget activated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Close budget
 * @route POST /api/v1/finance/budgets/:budgetId/close
 * @access Private (Finance Manager)
 */
const closeBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.closeBudget(
      req.params.budgetId,
      req.body.closedBy,
      req.body.closedDate,
      req.body.closureReason,
      req.tenantId
    );
    res.json(successResponse(budget, 'Budget closed successfully'));
  } catch (error) {
    next(error);
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