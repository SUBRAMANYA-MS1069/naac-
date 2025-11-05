const GSTTransaction = require('../../models/tax/GSTTransaction');
const { calculateGST } = require('../../utils/calculators/taxCalculator');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new GST transaction
 * @param {Object} gstData - GST transaction data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created GST transaction
 */
const createGSTTransaction = async (gstData, tenantId) => {
  try {
    // Add tenantId to GST data
    gstData.tenantId = tenantId;
    
    // Calculate GST amounts
    const gstCalculation = calculateGST(
      gstData.taxableAmount,
      gstData.gstRate,
      gstData.placeOfSupply === 'InterState' ? 'InterState' : 'IntraState'
    );
    
    gstData.cgst = gstCalculation.cgst;
    gstData.sgst = gstCalculation.sgst;
    gstData.igst = gstCalculation.igst;
    gstData.totalGST = gstCalculation.totalGST;
    gstData.totalAmount = gstData.taxableAmount + gstCalculation.totalGST;
    
    // Create GST transaction
    const gstTransaction = new GSTTransaction(gstData);
    await gstTransaction.save();
    
    return gstTransaction;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('GST transaction with this invoice number already exists', 409, 'DUPLICATE_GST_TRANSACTION');
    }
    throw error;
  }
};

/**
 * Get GST transactions with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} GST transactions and pagination info
 */
const getGSTTransactions = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle transaction type filter
    if (filters.transactionType) {
      query.transactionType = filters.transactionType;
    }
    
    // Handle financial year filter
    if (filters.financialYear) {
      query.financialYear = filters.financialYear;
    }
    
    // Handle quarter filter
    if (filters.quarter) {
      query.quarter = filters.quarter;
    }
    
    // Handle date range filter
    if (filters.startDate || filters.endDate) {
      query.invoiceDate = {};
      if (filters.startDate) {
        query.invoiceDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.invoiceDate.$lte = new Date(filters.endDate);
      }
    }
    
    const transactions = await GSTTransaction.find(query)
      .sort(pagination.sort || '-invoiceDate')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await GSTTransaction.countDocuments(query);
    
    return {
      transactions,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch GST transactions', 500, 'FETCH_GST_TRANSACTIONS_ERROR');
  }
};

/**
 * Get GST transaction by ID
 * @param {String} transactionId - Transaction ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} GST transaction
 */
const getGSTTransactionById = async (transactionId, tenantId) => {
  try {
    const transaction = await GSTTransaction.findOne({ gstTransactionId: transactionId, tenantId });
    
    if (!transaction) {
      throw new AppError('GST transaction not found', 404, 'GST_TRANSACTION_NOT_FOUND');
    }
    
    return transaction;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid GST transaction ID', 400, 'INVALID_GST_TRANSACTION_ID');
    }
    throw error;
  }
};

/**
 * Update GST transaction
 * @param {String} transactionId - Transaction ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated GST transaction
 */
const updateGSTTransaction = async (transactionId, updateData, tenantId) => {
  try {
    // Recalculate GST if taxable amount or rate is updated
    if (updateData.taxableAmount !== undefined || updateData.gstRate !== undefined) {
      const taxableAmount = updateData.taxableAmount || (await GSTTransaction.findOne({ gstTransactionId: transactionId, tenantId }))?.taxableAmount;
      const gstRate = updateData.gstRate || (await GSTTransaction.findOne({ gstTransactionId: transactionId, tenantId }))?.gstRate;
      const placeOfSupply = updateData.placeOfSupply || (await GSTTransaction.findOne({ gstTransactionId: transactionId, tenantId }))?.placeOfSupply;
      
      const gstCalculation = calculateGST(
        taxableAmount,
        gstRate,
        placeOfSupply === 'InterState' ? 'InterState' : 'IntraState'
      );
      
      updateData.cgst = gstCalculation.cgst;
      updateData.sgst = gstCalculation.sgst;
      updateData.igst = gstCalculation.igst;
      updateData.totalGST = gstCalculation.totalGST;
      updateData.totalAmount = taxableAmount + gstCalculation.totalGST;
    }
    
    const transaction = await GSTTransaction.findOneAndUpdate(
      { gstTransactionId: transactionId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      throw new AppError('GST transaction not found', 404, 'GST_TRANSACTION_NOT_FOUND');
    }
    
    return transaction;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid GST transaction ID', 400, 'INVALID_GST_TRANSACTION_ID');
    }
    throw error;
  }
};

/**
 * Delete GST transaction (soft delete)
 * @param {String} transactionId - Transaction ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteGSTTransaction = async (transactionId, tenantId) => {
  try {
    const transaction = await GSTTransaction.findOneAndUpdate(
      { gstTransactionId: transactionId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!transaction) {
      throw new AppError('GST transaction not found', 404, 'GST_TRANSACTION_NOT_FOUND');
    }
    
    return {
      message: 'GST transaction deleted successfully',
      transaction
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid GST transaction ID', 400, 'INVALID_GST_TRANSACTION_ID');
    }
    throw error;
  }
};

/**
 * Get GSTR1 filing status
 * @param {String} financialYear - Financial year
 * @param {String} quarter - Quarter
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Filing status
 */
const getGSTR1FilingStatus = async (financialYear, quarter, tenantId) => {
  try {
    const transactions = await GSTTransaction.find({ 
      tenantId, 
      financialYear, 
      quarter 
    });
    
    const totalTransactions = transactions.length;
    const filedTransactions = transactions.filter(t => t.gstr1FilingStatus === 'Filed').length;
    
    return {
      financialYear,
      quarter,
      totalTransactions,
      filedTransactions,
      pendingTransactions: totalTransactions - filedTransactions,
      filingPercentage: totalTransactions > 0 ? (filedTransactions / totalTransactions) * 100 : 0
    };
  } catch (error) {
    throw new AppError('Failed to get GSTR1 filing status', 500, 'GSTR1_FILING_STATUS_ERROR');
  }
};

module.exports = {
  createGSTTransaction,
  getGSTTransactions,
  getGSTTransactionById,
  updateGSTTransaction,
  deleteGSTTransaction,
  getGSTR1FilingStatus
};