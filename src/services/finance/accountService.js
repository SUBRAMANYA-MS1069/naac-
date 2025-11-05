const Account = require('../../models/finance/Account');
const { AppError } = require('../../utils/helpers/errorHelper');
const { calculateAccountBalance } = require('../../utils/calculators/balanceCalculator');
const Transaction = require('../../models/finance/Transaction');

/**
 * Create a new account
 * @param {Object} accountData - Account data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created account
 */
const createAccount = async (accountData, tenantId) => {
  try {
    // Add tenantId to account data
    accountData.tenantId = tenantId;
    
    // Check if account with same code already exists
    const existingAccount = await Account.findOne({
      tenantId,
      accountCode: accountData.accountCode
    });
    
    if (existingAccount) {
      throw new AppError('Account with this code already exists', 409, 'DUPLICATE_ACCOUNT_CODE');
    }
    
    // Create new account
    const account = new Account(accountData);
    await account.save();
    
    return account;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Account with this code already exists', 409, 'DUPLICATE_ACCOUNT_CODE');
    }
    throw error;
  }
};

/**
 * Get all accounts with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Accounts and pagination info
 */
const getAccounts = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle active filter
    if (filters.active !== undefined) {
      query.isActive = filters.active;
    }
    
    // Handle search
    if (filters.search) {
      query.$or = [
        { accountName: { $regex: filters.search, $options: 'i' } },
        { accountCode: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    const accounts = await Account.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await Account.countDocuments(query);
    
    return {
      accounts,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch accounts', 500, 'FETCH_ACCOUNTS_ERROR');
  }
};

/**
 * Get account by ID
 * @param {String} accountId - Account ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Account
 */
const getAccountById = async (accountId, tenantId) => {
  try {
    const account = await Account.findOne({ accountId, tenantId });
    
    if (!account) {
      throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
    }
    
    return account;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid account ID', 400, 'INVALID_ACCOUNT_ID');
    }
    throw error;
  }
};

/**
 * Update account
 * @param {String} accountId - Account ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated account
 */
const updateAccount = async (accountId, updateData, tenantId) => {
  try {
    const account = await Account.findOneAndUpdate(
      { accountId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!account) {
      throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
    }
    
    return account;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid account ID', 400, 'INVALID_ACCOUNT_ID');
    }
    throw error;
  }
};

/**
 * Get account balance
 * @param {String} accountId - Account ID
 * @param {String} tenantId - Tenant ID
 * @param {Date} asOfDate - Date to calculate balance as of
 * @returns {Object} Account balance details
 */
const getAccountBalance = async (accountId, tenantId, asOfDate = null) => {
  try {
    // Get account
    const account = await Account.findOne({ accountId, tenantId });
    
    if (!account) {
      throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
    }
    
    // Build transaction query
    const transactionQuery = {
      accountId,
      tenantId
    };
    
    // Add date filter if provided
    if (asOfDate) {
      transactionQuery.transactionDate = { $lte: new Date(asOfDate) };
    }
    
    // Get transactions
    const transactions = await Transaction.find(transactionQuery);
    
    // Calculate balance
    const balanceDetails = calculateAccountBalance(transactions, account.openingBalance);
    
    return {
      accountId: account.accountId,
      accountCode: account.accountCode,
      accountName: account.accountName,
      ...balanceDetails,
      asOfDate: asOfDate || new Date()
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid account ID', 400, 'INVALID_ACCOUNT_ID');
    }
    throw error;
  }
};

/**
 * Delete account (soft delete)
 * @param {String} accountId - Account ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteAccount = async (accountId, tenantId) => {
  try {
    const account = await Account.findOneAndUpdate(
      { accountId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!account) {
      throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
    }
    
    return {
      message: 'Account deleted successfully',
      account
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid account ID', 400, 'INVALID_ACCOUNT_ID');
    }
    throw error;
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  getAccountBalance,
  deleteAccount
};