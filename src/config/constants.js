// Account Types
const ACCOUNT_TYPES = {
  ASSET: 'Asset',
  LIABILITY: 'Liability',
  EQUITY: 'Equity',
  REVENUE: 'Revenue',
  EXPENSE: 'Expense',
};

// Account Categories
const ACCOUNT_CATEGORIES = {
  CURRENT_ASSET: 'CurrentAsset',
  FIXED_ASSET: 'FixedAsset',
  CURRENT_LIABILITY: 'CurrentLiability',
  LONG_TERM_LIABILITY: 'LongTermLiability',
  INCOME: 'Income',
  DIRECT_EXPENSE: 'DirectExpense',
  INDIRECT_EXPENSE: 'IndirectExpense',
};

// Journal Entry Types
const JOURNAL_ENTRY_TYPES = {
  JOURNAL: 'Journal',
  PAYMENT: 'Payment',
  RECEIPT: 'Receipt',
  CONTRA_ENTRY: 'ContraEntry',
  ADJUSTMENT: 'Adjustment',
};

// Budget Types
const BUDGET_TYPES = {
  ANNUAL: 'Annual',
  QUARTERLY: 'Quarterly',
  PROJECT: 'Project',
  DEPARTMENT: 'Department',
};

// Budget Statuses
const BUDGET_STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  REJECTED: 'Rejected',
};

// Fee Types
const FEE_TYPES = {
  TUITION: 'Tuition',
  ADMISSION: 'Admission',
  EXAMINATION: 'Examination',
  LIBRARY: 'Library',
  LABORATORY: 'Laboratory',
  HOSTEL: 'Hostel',
  TRANSPORT: 'Transport',
  OTHER: 'Other',
};

// Payment Modes
const PAYMENT_MODES = {
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  DD: 'DD',
  NET_BANKING: 'NetBanking',
  UPI: 'UPI',
  CARD: 'Card',
  ONLINE_PAYMENT_GATEWAY: 'OnlinePaymentGateway',
};

// Scholarship Types
const SCHOLARSHIP_TYPES = {
  MERIT: 'Merit',
  NEED_BASED: 'NeedBased',
  SPORTS: 'Sports',
  CULTURAL: 'Cultural',
  GOVERNMENT: 'Government',
  PRIVATE: 'Private',
};

// Purchase Order Types
const PO_TYPES = {
  GOODS: 'Goods',
  SERVICES: 'Services',
  BOTH: 'Both',
};

// Vendor Types
const VENDOR_TYPES = {
  SUPPLIER: 'Supplier',
  SERVICE_PROVIDER: 'ServiceProvider',
  CONTRACTOR: 'Contractor',
  CONSULTANT: 'Consultant',
};

// Bill Types
const BILL_TYPES = {
  GOODS: 'Goods',
  SERVICES: 'Services',
  UTILITY: 'Utility',
  SALARY: 'Salary',
  OTHER: 'Other',
};

// Payment Types
const PAYMENT_TYPES = {
  VENDOR: 'Vendor',
  SALARY: 'Salary',
  UTILITY: 'Utility',
  TAX: 'Tax',
  OTHER: 'Other',
};

// Salary Components
const SALARY_COMPONENT_TYPES = {
  FIXED: 'Fixed',
  ALLOWANCE: 'Allowance',
  DEDUCTION: 'Deduction',
};

// Tax Types
const TAX_TYPES = {
  GST: 'GST',
  TDS: 'TDS',
};

// Report Formats
const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'xlsx',
  JSON: 'json',
};

// Financial Statement Types
const FINANCIAL_STATEMENT_TYPES = {
  INCOME_STATEMENT: 'IncomeStatement',
  BALANCE_SHEET: 'BalanceSheet',
  CASH_FLOW: 'CashFlow',
  TRIAL_BALANCE: 'TrialBalance',
};

// Audit Trail Actions
const AUDIT_ACTIONS = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  READ: 'Read',
};

// User Roles
const USER_ROLES = {
  ADMIN: 'Admin',
  FINANCE_MANAGER: 'FinanceManager',
  ACCOUNTANT: 'Accountant',
  AUDITOR: 'Auditor',
  STUDENT: 'Student',
  PARENT: 'Parent',
};

module.exports = {
  ACCOUNT_TYPES,
  ACCOUNT_CATEGORIES,
  JOURNAL_ENTRY_TYPES,
  BUDGET_TYPES,
  BUDGET_STATUSES,
  FEE_TYPES,
  PAYMENT_MODES,
  SCHOLARSHIP_TYPES,
  PO_TYPES,
  VENDOR_TYPES,
  BILL_TYPES,
  PAYMENT_TYPES,
  SALARY_COMPONENT_TYPES,
  TAX_TYPES,
  REPORT_FORMATS,
  FINANCIAL_STATEMENT_TYPES,
  AUDIT_ACTIONS,
  USER_ROLES,
};