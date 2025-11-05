const balanceService = require('../../services/finance/balanceService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');

/**
 * Get trial balance
 * @route GET /api/v1/finance/trial-balance
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getTrialBalance = async (req, res, next) => {
  try {
    const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate) : null;
    const trialBalance = await balanceService.getTrialBalance(req.tenantId, asOfDate);
    res.json(successResponse(trialBalance, 'Trial balance retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get account ledger
 * @route GET /api/v1/finance/ledger/:accountId
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getAccountLedger = async (req, res, next) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    const ledger = await balanceService.getAccountLedger(
      req.params.accountId,
      req.tenantId,
      startDate,
      endDate
    );
    
    res.json(successResponse(ledger, 'Account ledger retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get balance sheet
 * @route GET /api/v1/finance/balance-sheet
 * @access Private (Finance Manager, Auditor)
 */
const getBalanceSheet = async (req, res, next) => {
  try {
    const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate) : null;
    const balanceSheet = await balanceService.getBalanceSheet(req.tenantId, asOfDate);
    res.json(successResponse(balanceSheet, 'Balance sheet retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get income statement
 * @route GET /api/v1/finance/income-statement
 * @access Private (Finance Manager, Auditor)
 */
const getIncomeStatement = async (req, res, next) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    const incomeStatement = await balanceService.getIncomeStatement(
      req.tenantId,
      startDate,
      endDate
    );
    
    res.json(successResponse(incomeStatement, 'Income statement retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrialBalance,
  getAccountLedger,
  getBalanceSheet,
  getIncomeStatement
};