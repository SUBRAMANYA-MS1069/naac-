/**
 * Calculate total budget amount from quarters
 * @param {Array} quarters - Array of quarter objects with amount
 * @returns {Number} Total budget amount
 */
const calculateTotalBudget = (quarters) => {
  return quarters.reduce((total, quarter) => total + quarter.amount, 0);
};

/**
 * Calculate budget utilization percentage
 * @param {Number} budgetedAmount - Total budgeted amount
 * @param {Number} actualAmount - Actual amount spent
 * @returns {Number} Utilization percentage
 */
const calculateBudgetUtilization = (budgetedAmount, actualAmount) => {
  return budgetedAmount !== 0 ? (actualAmount / budgetedAmount) * 100 : 0;
};

/**
 * Calculate remaining budget
 * @param {Number} budgetedAmount - Total budgeted amount
 * @param {Number} actualAmount - Actual amount spent
 * @returns {Number} Remaining budget amount
 */
const calculateRemainingBudget = (budgetedAmount, actualAmount) => {
  return Math.max(0, budgetedAmount - actualAmount);
};

/**
 * Generate budget alerts based on utilization
 * @param {Number} utilizationPercentage - Budget utilization percentage
 * @param {Number} threshold - Alert threshold percentage
 * @returns {Object} Alert information
 */
const generateBudgetAlert = (utilizationPercentage, threshold = 80) => {
  let alertType = null;
  let severity = 'Low';
  
  if (utilizationPercentage >= 95) {
    alertType = 'OverBudget';
    severity = 'High';
  } else if (utilizationPercentage >= threshold) {
    alertType = 'NearingLimit';
    severity = utilizationPercentage >= 90 ? 'High' : 'Medium';
  }
  
  return {
    alertType,
    severity
  };
};

/**
 * Calculate quarterly budget distribution
 * @param {Number} totalBudget - Total budget amount
 * @param {String} distributionType - Distribution strategy
 * @returns {Array} Quarterly distribution
 */
const calculateQuarterlyDistribution = (totalBudget, distributionType = 'equal') => {
  const quarters = [];
  
  switch (distributionType) {
    case 'equal':
      const equalAmount = totalBudget / 4;
      for (let i = 1; i <= 4; i++) {
        quarters.push({
          quarter: i,
          amount: equalAmount
        });
      }
      break;
      
    case 'increasing':
      // Increasing distribution (Q1: 20%, Q2: 25%, Q3: 25%, Q4: 30%)
      quarters.push({ quarter: 1, amount: totalBudget * 0.20 });
      quarters.push({ quarter: 2, amount: totalBudget * 0.25 });
      quarters.push({ quarter: 3, amount: totalBudget * 0.25 });
      quarters.push({ quarter: 4, amount: totalBudget * 0.30 });
      break;
      
    case 'decreasing':
      // Decreasing distribution (Q1: 30%, Q2: 25%, Q3: 25%, Q4: 20%)
      quarters.push({ quarter: 1, amount: totalBudget * 0.30 });
      quarters.push({ quarter: 2, amount: totalBudget * 0.25 });
      quarters.push({ quarter: 3, amount: totalBudget * 0.25 });
      quarters.push({ quarter: 4, amount: totalBudget * 0.20 });
      break;
      
    default:
      // Default to equal distribution
      const defaultAmount = totalBudget / 4;
      for (let i = 1; i <= 4; i++) {
        quarters.push({
          quarter: i,
          amount: defaultAmount
        });
      }
  }
  
  return quarters;
};

module.exports = {
  calculateTotalBudget,
  calculateBudgetUtilization,
  calculateRemainingBudget,
  generateBudgetAlert,
  calculateQuarterlyDistribution
};