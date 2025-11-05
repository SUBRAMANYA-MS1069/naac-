const accountService = require('../../services/finance/accountService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new account
 * @route POST /api/v1/finance/accounts
 * @access Private (Finance Manager, Accountant)
 */
const createAccount = async (req, res, next) => {
  try {
    const account = await accountService.createAccount(req.body, req.tenantId);
    res.status(201).json(successResponse(account, 'Account created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all accounts
 * @route GET /api/v1/finance/accounts
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getAccounts = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      accountType: req.query.type,
      accountCategory: req.query.category,
      active: req.query.active,
      search: req.query.search
    };
    
    const result = await accountService.getAccounts(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.accounts,
      result.page,
      result.limit,
      result.total,
      'Accounts retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get account by ID
 * @route GET /api/v1/finance/accounts/:accountId
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getAccountById = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(req.params.accountId, req.tenantId);
    res.json(successResponse(account, 'Account retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update account
 * @route PUT /api/v1/finance/accounts/:accountId
 * @access Private (Finance Manager, Accountant)
 */
const updateAccount = async (req, res, next) => {
  try {
    const account = await accountService.updateAccount(req.params.accountId, req.body, req.tenantId);
    res.json(successResponse(account, 'Account updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get account balance
 * @route GET /api/v1/finance/accounts/:accountId/balance
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getAccountBalance = async (req, res, next) => {
  try {
    const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate) : null;
    const balance = await accountService.getAccountBalance(req.params.accountId, req.tenantId, asOfDate);
    res.json(successResponse(balance, 'Account balance retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  getAccountBalance
};