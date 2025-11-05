const BudgetLine = require('../../models/budget/BudgetLine');
const Transaction = require('../../models/finance/Transaction');
const { calculateBudgetVariance, calculateBudgetUtilization } = require('../../utils/calculators/budgetCalculator');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Calculate budget vs actuals
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @returns {Array} Budget vs actuals data
 */
const calculateBudgetVsActuals = async (budgetId, tenantId) => {
  try {
    // Get budget lines
    const budgetLines = await BudgetLine.find({ budgetId, tenantId });
    
    // Get actual transactions for budget period
    const actuals = await getActualsForBudgetLines(budgetLines, tenantId);
    
    // Calculate variances
    const budgetVsActuals = budgetLines.map(line => {
      const actualAmount = actuals[line.accountId] || 0;
      const varianceData = calculateBudgetVariance(line.totalBudget, actualAmount);
      
      return {
        budgetLineId: line.budgetLineId,
        accountId: line.accountId,
        accountName: line.accountName,
        budgetCategory: line.budgetCategory,
        budgetedAmount: line.totalBudget,
        actualAmount,
        variance: varianceData.variance,
        variancePercentage: varianceData.variancePercentage,
        status: varianceData.status
      };
    });
    
    return budgetVsActuals;
  } catch (error) {
    throw new AppError('Failed to calculate budget vs actuals', 500, 'BUDGET_VS_ACTUALS_ERROR');
  }
};

/**
 * Get actuals for budget lines
 * @param {Array} budgetLines - Budget lines
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Actual amounts by account
 */
const getActualsForBudgetLines = async (budgetLines, tenantId) => {
  try {
    const accountIds = budgetLines.map(line => line.accountId);
    
    // Get transactions for accounts
    const transactions = await Transaction.find({
      tenantId,
      accountId: { $in: accountIds }
    });
    
    // Group transactions by account
    const actuals = {};
    
    transactions.forEach(transaction => {
      if (!actuals[transaction.accountId]) {
        actuals[transaction.accountId] = 0;
      }
      
      if (transaction.transactionType === 'Debit') {
        // For expense accounts, debit increases the actual spending
        if (transaction.accountId === transaction.accountId) {
          actuals[transaction.accountId] += transaction.amount;
        }
      } else {
        // For income accounts, credit increases the actual income
        if (transaction.accountId === transaction.accountId) {
          actuals[transaction.accountId] += transaction.amount;
        }
      }
    });
    
    return actuals;
  } catch (error) {
    throw new AppError('Failed to get actuals for budget lines', 500, 'GET_ACTUALS_ERROR');
  }
};

/**
 * Calculate quarterly budget utilization
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @returns {Array} Quarterly utilization data
 */
const calculateQuarterlyUtilization = async (budgetId, tenantId) => {
  try {
    // Get budget lines
    const budgetLines = await BudgetLine.find({ budgetId, tenantId });
    
    // Calculate utilization for each line
    const quarterlyUtilization = budgetLines.map(line => {
      const quarterlyData = line.quarters.map(quarter => {
        // In a real implementation, you would get actuals for each quarter
        // For now, we'll use placeholder data
        const actualAmount = quarter.amount * (Math.random() * 0.8); // Random utilization
        const utilization = calculateBudgetUtilization(quarter.amount, actualAmount);
        
        return {
          quarter: quarter.quarter,
          budgetedAmount: quarter.amount,
          actualAmount,
          utilization
        };
      });
      
      return {
        budgetLineId: line.budgetLineId,
        accountName: line.accountName,
        quarters: quarterlyData
      };
    });
    
    return quarterlyUtilization;
  } catch (error) {
    throw new AppError('Failed to calculate quarterly utilization', 500, 'QUARTERLY_UTILIZATION_ERROR');
  }
};

/**
 * Generate budget summary
 * @param {String} budgetId - Budget ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Budget summary
 */
const generateBudgetSummary = async (budgetId, tenantId) => {
  try {
    // Get budget vs actuals
    const budgetVsActuals = await calculateBudgetVsActuals(budgetId, tenantId);
    
    // Calculate summary statistics
    const totalBudgeted = budgetVsActuals.reduce((sum, item) => sum + item.budgetedAmount, 0);
    const totalActual = budgetVsActuals.reduce((sum, item) => sum + item.actualAmount, 0);
    const totalVariance = totalBudgeted - totalActual;
    const overallUtilization = calculateBudgetUtilization(totalBudgeted, totalActual);
    
    // Count statuses
    const statusCounts = {
      OnTrack: 0,
      OverSpent: 0,
      NearingLimit: 0,
      UnderUtilized: 0
    };
    
    budgetVsActuals.forEach(item => {
      statusCounts[item.status]++;
    });
    
    return {
      totalBudgeted,
      totalActual,
      totalVariance,
      overallUtilization,
      statusCounts,
      details: budgetVsActuals
    };
  } catch (error) {
    throw new AppError('Failed to generate budget summary', 500, 'BUDGET_SUMMARY_ERROR');
  }
};

module.exports = {
  calculateBudgetVsActuals,
  calculateQuarterlyUtilization,
  generateBudgetSummary
};