const Account = require('../../models/finance/Account');
const Transaction = require('../../models/finance/Transaction');
const { calculateAccountBalance } = require('../../utils/calculators/balanceCalculator');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Get trial balance
 * @param {String} tenantId - Tenant ID
 * @param {Date} asOfDate - Date to calculate balance as of
 * @returns {Array} Trial balance data
 */
const getTrialBalance = async (tenantId, asOfDate = null) => {
  try {
    // Get all active accounts
    const accounts = await Account.find({ tenantId, isActive: true });
    
    // Build transaction query
    const transactionQuery = { tenantId };
    
    // Add date filter if provided
    if (asOfDate) {
      transactionQuery.transactionDate = { $lte: new Date(asOfDate) };
    }
    
    // Get all transactions
    const transactions = await Transaction.find(transactionQuery);
    
    // Group transactions by account
    const transactionsByAccount = {};
    transactions.forEach(transaction => {
      if (!transactionsByAccount[transaction.accountId]) {
        transactionsByAccount[transaction.accountId] = [];
      }
      transactionsByAccount[transaction.accountId].push(transaction);
    });
    
    // Calculate balance for each account
    const trialBalance = [];
    
    for (const account of accounts) {
      const accountTransactions = transactionsByAccount[account.accountId] || [];
      const balanceDetails = calculateAccountBalance(accountTransactions, account.openingBalance);
      
      trialBalance.push({
        accountId: account.accountId,
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        openingBalance: balanceDetails.openingBalance,
        debitTotal: balanceDetails.debitTotal,
        creditTotal: balanceDetails.creditTotal,
        currentBalance: balanceDetails.currentBalance
      });
    }
    
    return trialBalance;
  } catch (error) {
    throw new AppError('Failed to generate trial balance', 500, 'TRIAL_BALANCE_ERROR');
  }
};

/**
 * Get account ledger
 * @param {String} accountId - Account ID
 * @param {String} tenantId - Tenant ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Account ledger data
 */
const getAccountLedger = async (accountId, tenantId, startDate = null, endDate = null) => {
  try {
    // Get account
    const account = await Account.findOne({ accountId, tenantId });
    
    if (!account) {
      throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
    }
    
    // Build transaction query
    const transactionQuery = { accountId, tenantId };
    
    // Add date range filter
    if (startDate || endDate) {
      transactionQuery.transactionDate = {};
      if (startDate) {
        transactionQuery.transactionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        transactionQuery.transactionDate.$lte = new Date(endDate);
      }
    }
    
    // Get transactions
    const transactions = await Transaction.find(transactionQuery)
      .sort('transactionDate')
      .populate('journalEntryId', 'entryNumber entryDate description');
    
    // Calculate running balance
    let runningBalance = account.openingBalance || 0;
    
    const ledgerEntries = transactions.map(transaction => {
      if (transaction.transactionType === 'Debit') {
        runningBalance -= transaction.amount;
      } else {
        runningBalance += transaction.amount;
      }
      
      return {
        transactionId: transaction.transactionId,
        transactionDate: transaction.transactionDate,
        journalEntryId: transaction.journalEntryId,
        entryNumber: transaction.journalEntryId?.entryNumber,
        description: transaction.description || transaction.journalEntryId?.description,
        debit: transaction.transactionType === 'Debit' ? transaction.amount : 0,
        credit: transaction.transactionType === 'Credit' ? transaction.amount : 0,
        runningBalance
      };
    });
    
    return {
      account: {
        accountId: account.accountId,
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        openingBalance: account.openingBalance
      },
      transactions: ledgerEntries,
      closingBalance: runningBalance
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid account ID', 400, 'INVALID_ACCOUNT_ID');
    }
    throw error;
  }
};

/**
 * Get balance sheet data
 * @param {String} tenantId - Tenant ID
 * @param {Date} asOfDate - Date to calculate balance sheet as of
 * @returns {Object} Balance sheet data
 */
const getBalanceSheet = async (tenantId, asOfDate = null) => {
  try {
    // Get trial balance data
    const trialBalance = await getTrialBalance(tenantId, asOfDate);
    
    // Categorize accounts
    const assets = trialBalance.filter(account => account.accountType === 'Asset');
    const liabilities = trialBalance.filter(account => account.accountType === 'Liability');
    const equity = trialBalance.filter(account => account.accountType === 'Equity');
    
    // Calculate totals
    const totalAssets = assets.reduce((sum, account) => sum + account.currentBalance, 0);
    const totalLiabilities = liabilities.reduce((sum, account) => sum + account.currentBalance, 0);
    const totalEquity = equity.reduce((sum, account) => sum + account.currentBalance, 0);
    
    return {
      asOfDate: asOfDate || new Date(),
      assets: {
        accounts: assets,
        total: totalAssets
      },
      liabilities: {
        accounts: liabilities,
        total: totalLiabilities
      },
      equity: {
        accounts: equity,
        total: totalEquity
      },
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity
    };
  } catch (error) {
    throw new AppError('Failed to generate balance sheet', 500, 'BALANCE_SHEET_ERROR');
  }
};

/**
 * Get income statement data
 * @param {String} tenantId - Tenant ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Income statement data
 */
const getIncomeStatement = async (tenantId, startDate, endDate) => {
  try {
    // Get all revenue and expense accounts
    const accounts = await Account.find({
      tenantId,
      isActive: true,
      $or: [
        { accountType: 'Revenue' },
        { accountType: 'Expense' }
      ]
    });
    
    // Build transaction query
    const transactionQuery = {
      tenantId,
      accountId: { $in: accounts.map(account => account.accountId) },
      transactionDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    // Get transactions
    const transactions = await Transaction.find(transactionQuery);
    
    // Group transactions by account
    const transactionsByAccount = {};
    transactions.forEach(transaction => {
      if (!transactionsByAccount[transaction.accountId]) {
        transactionsByAccount[transaction.accountId] = [];
      }
      transactionsByAccount[transaction.accountId].push(transaction);
    });
    
    // Calculate account balances
    const incomeStatementAccounts = [];
    
    for (const account of accounts) {
      const accountTransactions = transactionsByAccount[account.accountId] || [];
      const balanceDetails = calculateAccountBalance(accountTransactions, 0);
      
      incomeStatementAccounts.push({
        accountId: account.accountId,
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        amount: Math.abs(balanceDetails.currentBalance) // Use absolute value for income statement
      });
    }
    
    // Separate revenue and expenses
    const revenueAccounts = incomeStatementAccounts.filter(account => account.accountType === 'Revenue');
    const expenseAccounts = incomeStatementAccounts.filter(account => account.accountType === 'Expense');
    
    // Calculate totals
    const totalRevenue = revenueAccounts.reduce((sum, account) => sum + account.amount, 0);
    const totalExpenses = expenseAccounts.reduce((sum, account) => sum + account.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    
    return {
      period: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      revenue: {
        accounts: revenueAccounts,
        total: totalRevenue
      },
      expenses: {
        accounts: expenseAccounts,
        total: totalExpenses
      },
      netIncome
    };
  } catch (error) {
    throw new AppError('Failed to generate income statement', 500, 'INCOME_STATEMENT_ERROR');
  }
};

module.exports = {
  getTrialBalance,
  getAccountLedger,
  getBalanceSheet,
  getIncomeStatement
};