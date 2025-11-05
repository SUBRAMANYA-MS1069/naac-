const BudgetAlert = require('../../models/budget/BudgetAlert');
const { generateBudgetAlert } = require('../../utils/calculators/budgetCalculator');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create budget alert
 * @param {Object} alertData - Alert data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created alert
 */
const createBudgetAlert = async (alertData, tenantId) => {
  try {
    // Add tenantId to alert data
    alertData.tenantId = tenantId;
    
    // Create alert
    const alert = new BudgetAlert(alertData);
    await alert.save();
    
    return alert;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Budget alert already exists', 409, 'DUPLICATE_BUDGET_ALERT');
    }
    throw error;
  }
};

/**
 * Get budget alerts
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @returns {Array} Budget alerts
 */
const getBudgetAlerts = async (budgetId, tenantId) => {
  try {
    const alerts = await BudgetAlert.find({ budgetId, tenantId, isActive: true });
    return alerts;
  } catch (error) {
    throw new AppError('Failed to fetch budget alerts', 500, 'FETCH_BUDGET_ALERTS_ERROR');
  }
};

/**
 * Update budget alert
 * @param {String} alertId - Alert ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated alert
 */
const updateBudgetAlert = async (alertId, updateData, tenantId) => {
  try {
    const alert = await BudgetAlert.findOneAndUpdate(
      { budgetAlertId: alertId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!alert) {
      throw new AppError('Budget alert not found', 404, 'BUDGET_ALERT_NOT_FOUND');
    }
    
    return alert;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget alert ID', 400, 'INVALID_BUDGET_ALERT_ID');
    }
    throw error;
  }
};

/**
 * Delete budget alert (soft delete)
 * @param {String} alertId - Alert ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteBudgetAlert = async (alertId, tenantId) => {
  try {
    const alert = await BudgetAlert.findOneAndUpdate(
      { budgetAlertId: alertId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!alert) {
      throw new AppError('Budget alert not found', 404, 'BUDGET_ALERT_NOT_FOUND');
    }
    
    return {
      message: 'Budget alert deleted successfully',
      alert
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid budget alert ID', 400, 'INVALID_BUDGET_ALERT_ID');
    }
    throw error;
  }
};

/**
 * Check budget thresholds and generate alerts
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @returns {Array} Generated alerts
 */
const checkBudgetThresholds = async (budgetId, tenantId) => {
  try {
    // In a real implementation, you would:
    // 1. Get current budget utilization
    // 2. Compare with alert thresholds
    // 3. Generate alerts for thresholds that are crossed
    
    // For now, we'll return placeholder data
    const alerts = [];
    
    // Example alert generation logic
    const utilizationPercentage = Math.random() * 100; // Random utilization for demo
    
    const alertInfo = generateBudgetAlert(utilizationPercentage, 80);
    
    if (alertInfo.alertType) {
      const alert = new BudgetAlert({
        tenantId,
        budgetId,
        alertType: alertInfo.alertType,
        threshold: 80,
        recipients: [], // Would be populated with actual recipients
        frequency: 'Daily',
        isActive: true
      });
      
      await alert.save();
      alerts.push(alert);
    }
    
    return alerts;
  } catch (error) {
    throw new AppError('Failed to check budget thresholds', 500, 'CHECK_BUDGET_THRESHOLDS_ERROR');
  }
};

module.exports = {
  createBudgetAlert,
  getBudgetAlerts,
  updateBudgetAlert,
  deleteBudgetAlert,
  checkBudgetThresholds
};