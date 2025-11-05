/**
 * Calculate liquidity ratios
 * @param {Object} balanceSheetData - Balance sheet data
 * @returns {Object} Liquidity ratios
 */
const calculateLiquidityRatios = (balanceSheetData) => {
  const { currentAssets, currentLiabilities, inventory, cashAndCashEquivalents } = balanceSheetData;
  
  const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
  const quickRatio = currentLiabilities !== 0 ? (currentAssets - inventory) / currentLiabilities : 0;
  const cashRatio = currentLiabilities !== 0 ? cashAndCashEquivalents / currentLiabilities : 0;
  
  return {
    currentRatio,
    quickRatio,
    cashRatio
  };
};

/**
 * Calculate profitability ratios
 * @param {Object} incomeStatementData - Income statement data
 * @param {Object} balanceSheetData - Balance sheet data
 * @returns {Object} Profitability ratios
 */
const calculateProfitabilityRatios = (incomeStatementData, balanceSheetData) => {
  const { netIncome, grossProfit, totalRevenue } = incomeStatementData;
  const { totalAssets, totalEquity } = balanceSheetData;
  
  const grossProfitMargin = totalRevenue !== 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netProfitMargin = totalRevenue !== 0 ? (netIncome / totalRevenue) * 100 : 0;
  const returnOnAssets = totalAssets !== 0 ? (netIncome / totalAssets) * 100 : 0;
  const returnOnEquity = totalEquity !== 0 ? (netIncome / totalEquity) * 100 : 0;
  
  return {
    grossProfitMargin,
    netProfitMargin,
    returnOnAssets,
    returnOnEquity
  };
};

/**
 * Calculate efficiency ratios
 * @param {Object} financialData - Financial data
 * @returns {Object} Efficiency ratios
 */
const calculateEfficiencyRatios = (financialData) => {
  const {
    totalRevenue,
    totalAssets,
    inventory,
    costOfGoodsSold,
    accountsReceivable,
    netCreditSales,
    accountsPayable,
    costOfSales
  } = financialData;
  
  const assetTurnover = totalAssets !== 0 ? totalRevenue / totalAssets : 0;
  const inventoryTurnover = inventory !== 0 ? costOfGoodsSold / inventory : 0;
  const receivablesTurnover = accountsReceivable !== 0 ? netCreditSales / accountsReceivable : 0;
  
  return {
    assetTurnover,
    inventoryTurnover,
    receivablesTurnover
  };
};

/**
 * Calculate leverage ratios
 * @param {Object} balanceSheetData - Balance sheet data
 * @returns {Object} Leverage ratios
 */
const calculateLeverageRatios = (balanceSheetData) => {
  const { totalLiabilities, totalEquity, totalAssets } = balanceSheetData;
  
  const debtToEquity = totalEquity !== 0 ? totalLiabilities / totalEquity : 0;
  const debtRatio = totalAssets !== 0 ? totalLiabilities / totalAssets : 0;
  const equityRatio = totalAssets !== 0 ? totalEquity / totalAssets : 0;
  
  return {
    debtToEquity,
    debtRatio,
    equityRatio
  };
};

module.exports = {
  calculateLiquidityRatios,
  calculateProfitabilityRatios,
  calculateEfficiencyRatios,
  calculateLeverageRatios
};