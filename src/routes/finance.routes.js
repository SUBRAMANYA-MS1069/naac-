const express = require('express');
const router = express.Router();

// Controllers
const accountController = require('../controllers/finance/accountController');
const journalEntryController = require('../controllers/finance/journalEntryController');
const transactionController = require('../controllers/finance/transactionController');

// Middleware
const authMiddleware = require('../middleware/auth.middleware');
const { financeManagerOnly, accountantOnly, auditorOnly } = require('../middleware/authorization.middleware');
const validate = require('../middleware/validation.middleware');
const tenantIsolation = require('../middleware/tenantIsolation.middleware');
const auditLog = require('../middleware/auditLog.middleware');

// Validators
const {
  createAccountValidator,
  updateAccountValidator,
  getAccountsValidator,
  getAccountByIdValidator,
  getAccountBalanceValidator
} = require('../utils/validators/accountValidator');

const {
  createJournalEntryValidator,
  updateJournalEntryValidator,
  getJournalEntriesValidator,
  getJournalEntryByIdValidator,
  postJournalEntryValidator,
  reverseJournalEntryValidator
} = require('../utils/validators/journalValidator');

// Account Routes
router.post(
  '/accounts',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  createAccountValidator,
  validate,
  auditLog('CREATE', 'Finance', 'Account'),
  accountController.createAccount
);

router.get(
  '/accounts',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getAccountsValidator,
  validate,
  auditLog('READ', 'Finance', 'Account'),
  accountController.getAccounts
);

router.get(
  '/accounts/:accountId',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getAccountByIdValidator,
  validate,
  auditLog('READ', 'Finance', 'Account'),
  accountController.getAccountById
);

router.put(
  '/accounts/:accountId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  updateAccountValidator,
  validate,
  auditLog('UPDATE', 'Finance', 'Account'),
  accountController.updateAccount
);

router.get(
  '/accounts/:accountId/balance',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getAccountBalanceValidator,
  validate,
  auditLog('READ', 'Finance', 'AccountBalance'),
  accountController.getAccountBalance
);

// Journal Entry Routes
router.post(
  '/journal-entries',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  createJournalEntryValidator,
  validate,
  auditLog('CREATE', 'Finance', 'JournalEntry'),
  journalEntryController.createJournalEntry
);

router.get(
  '/journal-entries',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getJournalEntriesValidator,
  validate,
  auditLog('READ', 'Finance', 'JournalEntry'),
  journalEntryController.getJournalEntries
);

router.get(
  '/journal-entries/:entryId',
  authMiddleware,
  accountantOnly,
  tenantIsolation,
  getJournalEntryByIdValidator,
  validate,
  auditLog('READ', 'Finance', 'JournalEntry'),
  journalEntryController.getJournalEntryById
);

router.put(
  '/journal-entries/:entryId',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  updateJournalEntryValidator,
  validate,
  auditLog('UPDATE', 'Finance', 'JournalEntry'),
  journalEntryController.updateJournalEntry
);

router.post(
  '/journal-entries/:entryId/post',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  postJournalEntryValidator,
  validate,
  auditLog('UPDATE', 'Finance', 'JournalEntry'),
  journalEntryController.postJournalEntry
);

router.post(
  '/journal-entries/:entryId/reverse',
  authMiddleware,
  financeManagerOnly,
  tenantIsolation,
  reverseJournalEntryValidator,
  validate,
  auditLog('UPDATE', 'Finance', 'JournalEntry'),
  journalEntryController.reverseJournalEntry
);

// Financial Statements Routes
router.get(
  '/trial-balance',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Finance', 'TrialBalance'),
  transactionController.getTrialBalance
);

router.get(
  '/ledger/:accountId',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Finance', 'AccountLedger'),
  transactionController.getAccountLedger
);

router.get(
  '/balance-sheet',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Finance', 'BalanceSheet'),
  transactionController.getBalanceSheet
);

router.get(
  '/income-statement',
  authMiddleware,
  auditorOnly,
  tenantIsolation,
  auditLog('READ', 'Finance', 'IncomeStatement'),
  transactionController.getIncomeStatement
);

module.exports = router;