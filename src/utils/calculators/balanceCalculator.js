/**
 * Calculate account balance based on transactions
 * @param {Array} transactions - Array of transaction objects
 * @param {Number} openingBalance - Opening balance of the account
 * @returns {Object} Balance details
 */
const calculateAccountBalance = (transactions, openingBalance = 0) => {
  let debitTotal = 0;
  let creditTotal = 0;
  
  transactions.forEach(transaction => {
    if (transaction.transactionType === 'Debit') {
      debitTotal += transaction.amount;
    } else if (transaction.transactionType === 'Credit') {
      creditTotal += transaction.amount;
    }
  });
  
  const currentBalance = openingBalance + creditTotal - debitTotal;
  
  return {
    openingBalance,
    debitTotal,
    creditTotal,
    currentBalance
  };
};

/**
 * Calculate budget variance
 * @param {Number} budgetedAmount - Budgeted amount
 * @param {Number} actualAmount - Actual amount spent
 * @returns {Object} Variance details
 */
const calculateBudgetVariance = (budgetedAmount, actualAmount) => {
  const variance = budgetedAmount - actualAmount;
  const variancePercentage = budgetedAmount !== 0 ? (variance / budgetedAmount) * 100 : 0;
  
  let status = 'OnTrack';
  if (variance < 0) {
    status = 'OverSpent';
  } else if (variancePercentage < 20) {
    status = 'NearingLimit';
  } else if (actualAmount === 0) {
    status = 'UnderUtilized';
  }
  
  return {
    budgetedAmount,
    actualAmount,
    variance,
    variancePercentage,
    status
  };
};

/**
 * Calculate financial ratios
 * @param {Object} financialData - Financial data for calculations
 * @returns {Object} Financial ratios
 */
const calculateFinancialRatios = (financialData) => {
  const {
    currentAssets,
    currentLiabilities,
    quickAssets,
    cashAndCashEquivalents,
    totalAssets,
    totalLiabilities,
    totalEquity,
    grossProfit,
    netIncome,
    totalRevenue,
    inventory,
    costOfGoodsSold,
    accountsReceivable,
    netCreditSales,
    accountsPayable,
    costOfSales
  } = financialData;
  
  // Liquidity Ratios
  const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
  const quickRatio = currentLiabilities !== 0 ? quickAssets / currentLiabilities : 0;
  const cashRatio = currentLiabilities !== 0 ? cashAndCashEquivalents / currentLiabilities : 0;
  
  // Profitability Ratios
  const grossProfitMargin = totalRevenue !== 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netProfitMargin = totalRevenue !== 0 ? (netIncome / totalRevenue) * 100 : 0;
  const returnOnAssets = totalAssets !== 0 ? (netIncome / totalAssets) * 100 : 0;
  const returnOnEquity = totalEquity !== 0 ? (netIncome / totalEquity) * 100 : 0;
  
  // Efficiency Ratios
  const assetTurnover = totalAssets !== 0 ? totalRevenue / totalAssets : 0;
  const inventoryTurnover = inventory !== 0 ? costOfGoodsSold / inventory : 0;
  const receivablesTurnover = accountsReceivable !== 0 ? netCreditSales / accountsReceivable : 0;
  
  // Leverage Ratios
  const debtToEquity = totalEquity !== 0 ? totalLiabilities / totalEquity : 0;
  const debtRatio = totalAssets !== 0 ? totalLiabilities / totalAssets : 0;
  const equityRatio = totalAssets !== 0 ? totalEquity / totalAssets : 0;
  
  return {
    liquidityRatios: {
      currentRatio,
      quickRatio,
      cashRatio
    },
    profitabilityRatios: {
      grossProfitMargin,
      netProfitMargin,
      returnOnAssets,
      returnOnEquity
    },
    efficiencyRatios: {
      assetTurnover,
      inventoryTurnover,
      receivablesTurnover
    },
    leverageRatios: {
      debtToEquity,
      debtRatio,
      equityRatio
    }
  };
};

module.exports = {
  calculateAccountBalance,
  calculateBudgetVariance,
  calculateFinancialRatios
};