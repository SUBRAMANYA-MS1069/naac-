const gstService = require('../../services/tax/gstService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new GST transaction
 * @route POST /api/v1/finance/tax/gst-transactions
 * @access Private (Finance Manager, Accountant)
 */
const createGSTTransaction = async (req, res, next) => {
  try {
    const gstTransaction = await gstService.createGSTTransaction(req.body, req.tenantId);
    res.status(201).json(successResponse(gstTransaction, 'GST transaction created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all GST transactions
 * @route GET /api/v1/finance/tax/gst-transactions
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getGSTTransactions = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      transactionType: req.query.transactionType,
      financialYear: req.query.financialYear,
      quarter: req.query.quarter,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await gstService.getGSTTransactions(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.transactions,
      result.page,
      result.limit,
      result.total,
      'GST transactions retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get GST transaction by ID
 * @route GET /api/v1/finance/tax/gst-transactions/:transactionId
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getGSTTransactionById = async (req, res, next) => {
  try {
    const transaction = await gstService.getGSTTransactionById(req.params.transactionId, req.tenantId);
    res.json(successResponse(transaction, 'GST transaction retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update GST transaction
 * @route PUT /api/v1/finance/tax/gst-transactions/:transactionId
 * @access Private (Finance Manager, Accountant)
 */
const updateGSTTransaction = async (req, res, next) => {
  try {
    const transaction = await gstService.updateGSTTransaction(req.params.transactionId, req.body, req.tenantId);
    res.json(successResponse(transaction, 'GST transaction updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update GSTR1 filing status
 * @route POST /api/v1/finance/tax/gst-transactions/:transactionId/gstr1-status
 * @access Private (Finance Manager)
 */
const updateGSTR1FilingStatus = async (req, res, next) => {
  try {
    const transaction = await gstService.updateGSTR1FilingStatus(
      req.params.transactionId,
      req.body.status,
      req.body.filingDate,
      req.tenantId
    );
    res.json(successResponse(transaction, 'GSTR1 filing status updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update GSTR3B filing status
 * @route POST /api/v1/finance/tax/gst-transactions/:transactionId/gstr3b-status
 * @access Private (Finance Manager)
 */
const updateGSTR3BFilingStatus = async (req, res, next) => {
  try {
    const transaction = await gstService.updateGSTR3BFilingStatus(
      req.params.transactionId,
      req.body.status,
      req.body.filingDate,
      req.tenantId
    );
    res.json(successResponse(transaction, 'GSTR3B filing status updated successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGSTTransaction,
  getGSTTransactions,
  getGSTTransactionById,
  updateGSTTransaction,
  updateGSTR1FilingStatus,
  updateGSTR3BFilingStatus
};