const journalService = require('../../services/finance/journalService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new journal entry
 * @route POST /api/v1/finance/journal-entries
 * @access Private (Finance Manager, Accountant)
 */
const createJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await journalService.createJournalEntry(req.body, req.tenantId, req.user.userId);
    res.status(201).json(successResponse(journalEntry, 'Journal entry created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all journal entries
 * @route GET /api/v1/finance/journal-entries
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getJournalEntries = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      status: req.query.status,
      entryType: req.query.entryType
    };
    
    const result = await journalService.getJournalEntries(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.journalEntries,
      result.page,
      result.limit,
      result.total,
      'Journal entries retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get journal entry by ID
 * @route GET /api/v1/finance/journal-entries/:entryId
 * @access Private (Finance Manager, Accountant, Auditor)
 */
const getJournalEntryById = async (req, res, next) => {
  try {
    const journalEntry = await journalService.getJournalEntryById(req.params.entryId, req.tenantId);
    res.json(successResponse(journalEntry, 'Journal entry retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update journal entry
 * @route PUT /api/v1/finance/journal-entries/:entryId
 * @access Private (Finance Manager, Accountant)
 */
const updateJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await journalService.updateJournalEntry(req.params.entryId, req.body, req.tenantId);
    res.json(successResponse(journalEntry, 'Journal entry updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Post journal entry
 * @route POST /api/v1/finance/journal-entries/:entryId/post
 * @access Private (Finance Manager)
 */
const postJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await journalService.postJournalEntry(
      req.params.entryId, 
      req.body.postDate, 
      req.user.userId, 
      req.tenantId
    );
    res.json(successResponse(journalEntry, 'Journal entry posted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Reverse journal entry
 * @route POST /api/v1/finance/journal-entries/:entryId/reverse
 * @access Private (Finance Manager)
 */
const reverseJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await journalService.reverseJournalEntry(
      req.params.entryId,
      req.body.reversalDate,
      req.body.reason,
      req.user.userId,
      req.tenantId
    );
    res.json(successResponse(journalEntry, 'Journal entry reversed successfully'));
  } catch (error) {
    next(error);
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