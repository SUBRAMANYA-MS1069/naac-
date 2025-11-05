const budgetCalculationService = require('../../services/budget/budgetCalculationService');
const budgetAlertService = require('../../services/budget/budgetAlertService');
const { successResponse, errorResponse } = require('../../utils/helpers/responseHelper');

/**
 * Get budget vs actuals
 * @route GET /api/v1/finance/budgets/:budgetId/actuals
 * @access Private (Finance Manager, Auditor)
 */
const getBudgetVsActuals = async (req, res, next) => {
  try {
    const budgetVsActuals = await budgetCalculationService.calculateBudgetVsActuals(
      req.params.budgetId,
      req.tenantId
    );
    res.json(successResponse(budgetVsActuals, 'Budget vs actuals retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get quarterly budget utilization
 * @route GET /api/v1/finance/budgets/:budgetId/quarterly-utilization
 * @access Private (Finance Manager, Auditor)
 */
const getQuarterlyUtilization = async (req, res, next) => {
  try {
    const quarterlyUtilization = await budgetCalculationService.calculateQuarterlyUtilization(
      req.params.budgetId,
      req.tenantId
    );
    res.json(successResponse(quarterlyUtilization, 'Quarterly utilization retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get budget summary
 * @route GET /api/v1/finance/budgets/:budgetId/summary
 * @access Private (Finance Manager, Auditor)
 */
const getBudgetSummary = async (req, res, next) => {
  try {
    const summary = await budgetCalculationService.getBudgetSummary(
      req.params.budgetId,
      req.tenantId
    );
    res.json(successResponse(summary, 'Budget summary retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Create budget alert
 * @route POST /api/v1/finance/budgets/:budgetId/alerts
 * @access Private (Finance Manager)
 */
const createBudgetAlert = async (req, res, next) => {
  try {
    const alert = await budgetAlertService.createBudgetAlert(req.body, req.tenantId);
    res.status(201).json(successResponse(alert, 'Budget alert created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get budget alerts
 * @route GET /api/v1/finance/budgets/:budgetId/alerts
 * @access Private (Finance Manager)
 */
const getBudgetAlerts = async (req, res, next) => {
  try {
    const alerts = await budgetAlertService.getBudgetAlerts(req.params.budgetId, req.tenantId);
    res.json(successResponse(alerts, 'Budget alerts retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update budget alert
 * @route PUT /api/v1/finance/budgets/alerts/:alertId
 * @access Private (Finance Manager)
 */
const updateBudgetAlert = async (req, res, next) => {
  try {
    const alert = await budgetAlertService.updateBudgetAlert(
      req.params.alertId,
      req.body,
      req.tenantId
    );
    res.json(successResponse(alert, 'Budget alert updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete budget alert
 * @route DELETE /api/v1/finance/budgets/alerts/:alertId
 * @access Private (Finance Manager)
 */
const deleteBudgetAlert = async (req, res, next) => {
  try {
    const result = await budgetAlertService.deleteBudgetAlert(req.params.alertId, req.tenantId);
    res.json(successResponse(result, 'Budget alert deleted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Check budget thresholds
 * @route POST /api/v1/finance/budgets/:budgetId/check-thresholds
 * @access Private (Finance Manager)
 */
const checkBudgetThresholds = async (req, res, next) => {
  try {
    const alerts = await budgetAlertService.checkBudgetThresholds(req.params.budgetId, req.tenantId);
    res.json(successResponse(alerts, 'Budget thresholds checked successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgetVsActuals,
  getQuarterlyUtilization,
  getBudgetSummary,
  createBudgetAlert,
  getBudgetAlerts,
  updateBudgetAlert,
  deleteBudgetAlert,
  checkBudgetThresholds
};