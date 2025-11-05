const JournalEntry = require('../../models/finance/JournalEntry');
const Transaction = require('../../models/finance/Transaction');
const Account = require('../../models/finance/Account');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new journal entry
 * @param {Object} journalData - Journal entry data
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Created journal entry
 */
const createJournalEntry = async (journalData, tenantId, userId) => {
  try {
    // Add tenantId and createdBy to journal data
    journalData.tenantId = tenantId;
    journalData.createdBy = userId;
    
    // Validate that total debit equals total credit
    const totalDebit = journalData.lineItems.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalCredit = journalData.lineItems.reduce((sum, item) => sum + (item.credit || 0), 0);
    
    if (totalDebit !== totalCredit) {
      throw new AppError('Total debit must equal total credit', 400, 'INVALID_JOURNAL_ENTRY');
    }
    
    // Set totals
    journalData.totalDebit = totalDebit;
    journalData.totalCredit = totalCredit;
    
    // Create journal entry
    const journalEntry = new JournalEntry(journalData);
    await journalEntry.save();
    
    return journalEntry;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Journal entry with this number already exists', 409, 'DUPLICATE_JOURNAL_NUMBER');
    }
    throw error;
  }
};

/**
 * Get journal entries with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Journal entries and pagination info
 */
const getJournalEntries = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle date range filter
    if (filters.startDate || filters.endDate) {
      query.entryDate = {};
      if (filters.startDate) {
        query.entryDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.entryDate.$lte = new Date(filters.endDate);
      }
    }
    
    const journalEntries = await JournalEntry.find(query)
      .sort(pagination.sort || '-entryDate')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('lineItems.accountId', 'accountCode accountName')
      .populate('createdBy', 'name email');
    
    const total = await JournalEntry.countDocuments(query);
    
    return {
      journalEntries,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch journal entries', 500, 'FETCH_JOURNAL_ENTRIES_ERROR');
  }
};

/**
 * Get journal entry by ID
 * @param {String} entryId - Journal entry ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Journal entry
 */
const getJournalEntryById = async (entryId, tenantId) => {
  try {
    const journalEntry = await JournalEntry.findOne({ journalEntryId: entryId, tenantId })
      .populate('lineItems.accountId', 'accountCode accountName')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('postedBy', 'name email');
    
    if (!journalEntry) {
      throw new AppError('Journal entry not found', 404, 'JOURNAL_ENTRY_NOT_FOUND');
    }
    
    return journalEntry;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid journal entry ID', 400, 'INVALID_JOURNAL_ENTRY_ID');
    }
    throw error;
  }
};

/**
 * Update journal entry
 * @param {String} entryId - Journal entry ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated journal entry
 */
const updateJournalEntry = async (entryId, updateData, tenantId) => {
  try {
    // Prevent updating posted entries
    const existingEntry = await JournalEntry.findOne({ journalEntryId: entryId, tenantId });
    
    if (!existingEntry) {
      throw new AppError('Journal entry not found', 404, 'JOURNAL_ENTRY_NOT_FOUND');
    }
    
    if (existingEntry.status === 'Posted') {
      throw new AppError('Cannot update posted journal entries', 400, 'CANNOT_UPDATE_POSTED_ENTRY');
    }
    
    // Validate debit/credit balance if line items are being updated
    if (updateData.lineItems) {
      const totalDebit = updateData.lineItems.reduce((sum, item) => sum + (item.debit || 0), 0);
      const totalCredit = updateData.lineItems.reduce((sum, item) => sum + (item.credit || 0), 0);
      
      if (totalDebit !== totalCredit) {
        throw new AppError('Total debit must equal total credit', 400, 'INVALID_JOURNAL_ENTRY');
      }
      
      updateData.totalDebit = totalDebit;
      updateData.totalCredit = totalCredit;
    }
    
    const journalEntry = await JournalEntry.findOneAndUpdate(
      { journalEntryId: entryId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    return journalEntry;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid journal entry ID', 400, 'INVALID_JOURNAL_ENTRY_ID');
    }
    throw error;
  }
};

/**
 * Post journal entry
 * @param {String} entryId - Journal entry ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Posted journal entry
 */
const postJournalEntry = async (entryId, tenantId, userId) => {
  try {
    // Get journal entry
    const journalEntry = await JournalEntry.findOne({ journalEntryId: entryId, tenantId });
    
    if (!journalEntry) {
      throw new AppError('Journal entry not found', 404, 'JOURNAL_ENTRY_NOT_FOUND');
    }
    
    if (journalEntry.status === 'Posted') {
      throw new AppError('Journal entry is already posted', 400, 'ENTRY_ALREADY_POSTED');
    }
    
    // Validate that total debit equals total credit
    if (journalEntry.totalDebit !== journalEntry.totalCredit) {
      throw new AppError('Total debit must equal total credit', 400, 'INVALID_JOURNAL_ENTRY');
    }
    
    // Create transactions for each line item
    const transactions = [];
    
    for (const lineItem of journalEntry.lineItems) {
      // Verify account exists and is active
      const account = await Account.findOne({ accountId: lineItem.accountId, tenantId, isActive: true });
      
      if (!account) {
        throw new AppError(`Account not found or inactive: ${lineItem.accountId}`, 400, 'INVALID_ACCOUNT');
      }
      
      // Create transaction
      const transaction = new Transaction({
        tenantId,
        accountId: lineItem.accountId,
        journalEntryId: journalEntry.journalEntryId,
        transactionDate: journalEntry.entryDate,
        transactionType: lineItem.debit > 0 ? 'Debit' : 'Credit',
        amount: lineItem.debit > 0 ? lineItem.debit : lineItem.credit,
        description: lineItem.description || journalEntry.description,
        referenceId: journalEntry.journalEntryId,
        referenceType: 'JournalEntry'
      });
      
      transactions.push(transaction);
    }
    
    // Save all transactions
    await Transaction.insertMany(transactions);
    
    // Update journal entry status
    journalEntry.status = 'Posted';
    journalEntry.postedDate = new Date();
    journalEntry.postedBy = userId;
    await journalEntry.save();
    
    return journalEntry;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid journal entry ID', 400, 'INVALID_JOURNAL_ENTRY_ID');
    }
    throw error;
  }
};

/**
 * Reverse journal entry
 * @param {String} entryId - Journal entry ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @param {Object} reversalData - Reversal data
 * @returns {Object} Reversed journal entry
 */
const reverseJournalEntry = async (entryId, tenantId, userId, reversalData) => {
  try {
    // Get original journal entry
    const originalEntry = await JournalEntry.findOne({ journalEntryId: entryId, tenantId });
    
    if (!originalEntry) {
      throw new AppError('Journal entry not found', 404, 'JOURNAL_ENTRY_NOT_FOUND');
    }
    
    if (originalEntry.status !== 'Posted') {
      throw new AppError('Only posted journal entries can be reversed', 400, 'ENTRY_NOT_POSTED');
    }
    
    // Create reversal entry
    const reversalEntryData = {
      entryNumber: `REV-${originalEntry.entryNumber}`,
      entryDate: reversalData.reversalDate,
      entryType: originalEntry.entryType,
      referenceNumber: originalEntry.entryNumber,
      description: `Reversal of ${originalEntry.description || originalEntry.entryNumber}`,
      lineItems: originalEntry.lineItems.map(item => ({
        accountId: item.accountId,
        debit: item.credit, // Swap debit and credit
        credit: item.debit,
        description: `Reversal: ${item.description || ''}`
      })),
      totalDebit: originalEntry.totalCredit,
      totalCredit: originalEntry.totalDebit,
      createdBy: userId,
      approvalRequired: false,
      status: 'Posted'
    };
    
    // Create reversal journal entry
    const reversalEntry = new JournalEntry({
      ...reversalEntryData,
      tenantId
    });
    
    await reversalEntry.save();
    
    // Create reversal transactions
    const transactions = [];
    
    for (const lineItem of reversalEntry.lineItems) {
      const transaction = new Transaction({
        tenantId,
        accountId: lineItem.accountId,
        journalEntryId: reversalEntry.journalEntryId,
        transactionDate: reversalEntry.entryDate,
        transactionType: lineItem.debit > 0 ? 'Debit' : 'Credit',
        amount: lineItem.debit > 0 ? lineItem.debit : lineItem.credit,
        description: lineItem.description || reversalEntry.description,
        referenceId: reversalEntry.journalEntryId,
        referenceType: 'ReversalEntry'
      });
      
      transactions.push(transaction);
    }
    
    // Save all transactions
    await Transaction.insertMany(transactions);
    
    // Update original entry
    originalEntry.status = 'Reversed';
    originalEntry.reversalDate = reversalData.reversalDate;
    originalEntry.reversalReason = reversalData.reason;
    originalEntry.reversedBy = userId;
    await originalEntry.save();
    
    return {
      originalEntry,
      reversalEntry
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid journal entry ID', 400, 'INVALID_JOURNAL_ENTRY_ID');
    }
    throw error;
  }
};

module.exports = {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  postJournalEntry,
  reverseJournalEntry
};