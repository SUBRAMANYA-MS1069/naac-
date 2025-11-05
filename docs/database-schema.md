# Database Schema Documentation

## Overview
This document describes the database schema for the NAAC Financial & Administrative Module. All collections follow the universal collections structure with tenant isolation and required fields.

## Universal Collection Structure
All collections include these required fields:
- `[entity]Id`: String (UUID) - Primary key
- `tenantId`: String - Tenant identifier for multi-tenancy
- `isActive`: Boolean - Soft delete flag
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last update timestamp

## Finance Module

### Account
Represents a chart of accounts entry.

**Fields:**
- `accountId`: String (UUID)
- `tenantId`: String
- `accountCode`: String (Unique)
- `accountName`: String
- `accountType`: String (Enum: Asset, Liability, Equity, Revenue, Expense)
- `accountCategory`: String (Enum: CurrentAsset, FixedAsset, CurrentLiability, LongTermLiability, Income, DirectExpense, IndirectExpense)
- `parentAccountId`: String (Reference to Account)
- `description`: String
- `openingBalance`: Number
- `openingBalanceDate`: Date
- `currentBalance`: Number
- `currency`: String (Default: INR)
- `isActive`: Boolean
- `taxApplicable`: Boolean
- `gstRate`: Number
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `accountId` (unique)
- `tenantId`
- `accountCode` (unique)
- `accountType`
- `accountCategory`
- `isActive`

### JournalEntry
Represents a financial journal entry.

**Fields:**
- `journalEntryId`: String (UUID)
- `tenantId`: String
- `entryNumber`: String (Unique)
- `entryDate`: Date
- `entryType`: String (Enum: Journal, Payment, Receipt, ContraEntry, Adjustment)
- `referenceNumber`: String
- `description`: String
- `lineItems`: Array of Objects
  - `accountId`: String (Reference to Account)
  - `debit`: Number
  - `credit`: Number
  - `description`: String
  - `costCenterId`: String
  - `projectId`: String
- `totalDebit`: Number
- `totalCredit`: Number
- `attachments`: Array of Strings
- `createdBy`: String (Reference to User)
- `approvalRequired`: Boolean
- `approvedBy`: String (Reference to User)
- `approvedDate`: Date
- `status`: String (Enum: Draft, Pending, Posted, Rejected, Reversed)
- `postedDate`: Date
- `postedBy`: String (Reference to User)
- `reversalDate`: Date
- `reversalReason`: String
- `reversedBy`: String (Reference to User)
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `journalEntryId` (unique)
- `tenantId`
- `entryNumber` (unique)
- `entryDate`
- `status`
- `entryType`
- `createdBy`

### Transaction
Represents individual financial transactions.

**Fields:**
- `transactionId`: String (UUID)
- `tenantId`: String
- `accountId`: String (Reference to Account)
- `journalEntryId`: String (Reference to JournalEntry)
- `transactionDate`: Date
- `transactionType`: String (Enum: Debit, Credit)
- `amount`: Number
- `description`: String
- `referenceId`: String
- `referenceType`: String
- `balanceAfterTransaction`: Number
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `transactionId` (unique)
- `tenantId`
- `accountId`
- `journalEntryId`
- `transactionDate`

### FinancialYear
Represents financial year settings.

**Fields:**
- `financialYearId`: String (UUID)
- `tenantId`: String
- `name`: String
- `startDate`: Date
- `endDate`: Date
- `isActive`: Boolean
- `isCurrent`: Boolean
- `closingStatus`: String (Enum: Open, Closed, Archived)
- `notes`: String
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `financialYearId` (unique)
- `tenantId`
- `isCurrent`
- `isActive`

## Budget Module

### Budget
Represents a budget master record.

**Fields:**
- `budgetId`: String (UUID)
- `tenantId`: String
- `budgetName`: String
- `financialYear`: String
- `budgetType`: String (Enum: Annual, Quarterly, Project, Department)
- `startDate`: Date
- `endDate`: Date
- `departmentId`: String
- `status`: String (Enum: Draft, Submitted, Approved, Active, Rejected, Closed)
- `totalIncome`: Number
- `totalExpense`: Number
- `netBudget`: Number
- `assumptions`: Array of Strings
- `preparedBy`: String (Reference to User)
- `reviewers`: Array of Strings (References to Users)
- `approvedBy`: String (Reference to User)
- `approvedDate`: Date
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `budgetId` (unique)
- `tenantId`
- `financialYear`
- `status`
- `departmentId`
- `budgetType`

### BudgetLine
Represents budget line items.

**Fields:**
- `budgetLineId`: String (UUID)
- `tenantId`: String
- `budgetId`: String (Reference to Budget)
- `accountId`: String (Reference to Account)
- `accountName`: String
- `budgetCategory`: String (Enum: Income, Expense)
- `quarters`: Array of Objects
  - `quarter`: Number (1-4)
  - `amount`: Number
- `totalBudget`: Number
- `notes`: String
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `budgetLineId` (unique)
- `tenantId`
- `budgetId`
- `accountId`
- `budgetCategory`

### BudgetRevision
Represents budget revisions.

**Fields:**
- `budgetRevisionId`: String (UUID)
- `tenantId`: String
- `budgetId`: String (Reference to Budget)
- `revisionNumber`: Number
- `revisionDate`: Date
- `reason`: String
- `changes`: Array of Objects
  - `accountId`: String (Reference to Account)
  - `oldAmount`: Number
  - `newAmount`: Number
  - `justification`: String
- `requestedBy`: String (Reference to User)
- `approvedBy`: String (Reference to User)
- `approvedDate`: Date
- `status`: String (Enum: Pending, Approved, Rejected)
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `budgetRevisionId` (unique)
- `tenantId`
- `budgetId`
- `status`
- `revisionDate`

### BudgetAlert
Represents budget alerts configuration.

**Fields:**
- `budgetAlertId`: String (UUID)
- `tenantId`: String
- `budgetId`: String (Reference to Budget)
- `alertType`: String (Enum: ThresholdReached, QuarterlyReview, MonthEnd)
- `threshold`: Number (0-100)
- `accountIds`: Array of Strings (References to Accounts)
- `recipients`: Array of Strings (References to Users)
- `frequency`: String (Enum: Daily, Weekly, Monthly)
- `isActive`: Boolean
- `lastSent`: Date
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `budgetAlertId` (unique)
- `tenantId`
- `budgetId`
- `alertType`
- `isActive`

## Fees Module

### FeeStructure
Represents fee structure master.

**Fields:**
- `feeStructureId`: String (UUID)
- `tenantId`: String
- `structureName`: String
- `academicYear`: String
- `programId`: String
- `semester`: String
- `feeType`: String (Enum: Tuition, Admission, Examination, Library, Laboratory, Hostel, Transport, Other)
- `studentCategory`: String (Enum: General, SC/ST, OBC, EWS, International)
- `components`: Array of Objects
  - `componentName`: String
  - `amount`: Number
  - `isMandatory`: Boolean
  - `isRefundable`: Boolean
  - `taxApplicable`: Boolean
  - `accountId`: String (Reference to Account)
- `totalFee`: Number
- `paymentSchedule`: Array of Objects
  - `installmentNumber`: Number
  - `dueDate`: Date
  - `amount`: Number
- `lateFeePolicy`: Object
  - `gracePeriodDays`: Number
  - `lateFeePerDay`: Number
  - `maxLateFee`: Number
- `discounts`: Array of Objects
  - `discountName`: String
  - `discountType`: String (Enum: Percentage, Fixed)
  - `discountValue`: Number
  - `eligibilityCriteria`: String
- `effectiveFrom`: Date
- `effectiveTo`: Date
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `feeStructureId` (unique)
- `tenantId`
- `academicYear`
- `programId`
- `feeType`
- `isActive`

### FeeInvoice
Represents student fee invoices.

**Fields:**
- `feeInvoiceId`: String (UUID)
- `tenantId`: String
- `invoiceNumber`: String (Unique)
- `studentId`: String
- `feeStructureId`: String (Reference to FeeStructure)
- `academicYear`: String
- `semester`: String
- `dueDate`: Date
- `totalAmount`: Number
- `discountsApplied`: Array of Objects
  - `discountId`: String (Reference to Discount)
  - `discountAmount`: Number
  - `reason`: String
- `adjustments`: Array of Objects
  - `description`: String
  - `amount`: Number
  - `reason`: String
- `finalAmount`: Number
- `paidAmount`: Number
- `balanceAmount`: Number
- `status`: String (Enum: Pending, PartiallyPaid, Paid, Overdue, Cancelled)
- `remarks`: String
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `feeInvoiceId` (unique)
- `tenantId`
- `studentId`
- `academicYear`
- `status`
- `dueDate`

### FeePayment
Represents payment records.

**Fields:**
- `feePaymentId`: String (UUID)
- `tenantId`: String
- `invoiceId`: String (Reference to FeeInvoice)
- `studentId`: String
- `paymentDate`: Date
- `paymentMode`: String (Enum: Cash, Cheque, DD, NetBanking, UPI, Card, OnlinePaymentGateway)
- `amount`: Number
- `transactionId`: String
- `bankName`: String
- `chequeNumber`: String
- `chequeDate`: Date
- `remarks`: String
- `receivedBy`: String (Reference to User)
- `allocations`: Array of Objects
  - `feeComponent`: String
  - `amount`: Number
- `status`: String (Enum: Success, Failed, Pending)
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `feePaymentId` (unique)
- `tenantId`
- `studentId`
- `invoiceId`
- `paymentDate`
- `paymentMode`
- `transactionId`

### FeeRefund
Represents refund records.

**Fields:**
- `feeRefundId`: String (UUID)
- `tenantId`: String
- `studentId`: String
- `paymentId`: String (Reference to FeePayment)
- `refundAmount`: Number
- `refundReason`: String
- `refundMode`: String (Enum: Cash, Cheque, BankTransfer)
- `bankDetails`: Object
  - `accountNumber`: String
  - `ifscCode`: String
  - `accountHolderName`: String
- `approvedBy`: String (Reference to User)
- `approvedDate`: Date
- `refundDate`: Date
- `referenceNumber`: String
- `status`: String (Enum: Pending, Approved, Processed, Rejected)
- `remarks`: String
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `feeRefundId` (unique)
- `tenantId`
- `studentId`
- `status`
- `refundDate`

### Scholarship
Represents scholarship schemes.

**Fields:**
- `scholarshipId`: String (UUID)
- `tenantId`: String
- `scholarshipName`: String
- `scholarshipType`: String (Enum: Merit, NeedBased, Sports, Cultural, Government, Private)
- `sponsorName`: String
- `academicYear`: String
- `eligibilityCriteria`: Object
  - `minimumCGPA`: Number
  - `familyIncome`: Object
    - `max`: Number
  - `category`: Array of Strings
  - `otherCriteria`: Array of Strings
- `benefitType`: String (Enum: FullTuitionWaiver, PartialTuitionWaiver, Stipend, FeeReduction)
- `benefitAmount`: Number
- `benefitPercentage`: Number
- `totalSlots`: Number
- `applicationStartDate`: Date
- `applicationEndDate`: Date
- `selectionProcess`: String
- `documents`: Array of Strings
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `scholarshipId` (unique)
- `tenantId`
- `academicYear`
- `scholarshipType`
- `isActive`

### ScholarshipApplication
Represents scholarship applications.

**Fields:**
- `scholarshipApplicationId`: String (UUID)
- `tenantId`: String
- `scholarshipId`: String (Reference to Scholarship)
- `studentId`: String
- `applicationDate`: Date
- `cgpa`: Number
- `familyIncome`: Number
- `category`: String (Enum: General, OBC, SC, ST, EWS)
- `supportingDocuments`: Array of Objects
  - `documentType`: String (Enum: IncomeCertificate, Marksheet, BankStatement, Other)
  - `documentUrl`: String
- `reasonForApplication`: String
- `status`: String (Enum: Pending, UnderReview, Approved, Rejected)
- `approvedAmount`: Number
- `approvedBy`: String (Reference to User)
- `approvedDate`: Date
- `comments`: String
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `scholarshipApplicationId` (unique)
- `tenantId`
- `scholarshipId`
- `studentId`
- `status`
- `applicationDate`

### ScholarshipDisbursement
Represents scholarship disbursement tracking.

**Fields:**
- `scholarshipDisbursementId`: String (UUID)
- `tenantId`: String
- `applicationId`: String (Reference to ScholarshipApplication)
- `studentId`: String
- `amount`: Number
- `disbursementDate`: Date
- `disbursementMode`: String (Enum: DirectFeeWaiver, BankTransfer, Cheque)
- `referenceNumber`: String
- `remarks`: String
- `disbursedBy`: String (Reference to User)
- `status`: String (Enum: Pending, Processed, Failed)
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `scholarshipDisbursementId` (unique)
- `tenantId`
- `studentId`
- `applicationId`
- `disbursementDate`
- `status`

## Expenditure Module

### PurchaseOrder
Represents purchase orders.

**Fields:**
- `poId`: String (UUID)
- `tenantId`: String
- `poNumber`: String (Unique)
- `poDate`: Date
- `vendorId`: String (Reference to Vendor)
- `departmentId`: String
- `requisitionId`: String
- `poType`: String (Enum: Goods, Services, Both)
- `deliveryDate`: Date
- `deliveryLocation`: String
- `items`: Array of Objects
  - `itemDescription`: String
  - `quantity`: Number
  - `unit`: String
  - `unitPrice`: Number
  - `taxRate`: Number
  - `taxAmount`: Number
  - `totalAmount`: Number
  - `specifications`: String
  - `accountId`: String (Reference to Account)
- `subtotal`: Number
- `taxTotal`: Number
- `shippingCharges`: Number
- `totalAmount`: Number
- `paymentTerms`: String
- `deliveryTerms`: String
- `warrantyDetails`: String
- `specialInstructions`: String
- `preparedBy`: String (Reference to User)
- `approvers`: Array of Objects
  - `userId`: String (Reference to User)
  - `approved`: Boolean
  - `approvedDate`: Date
  - `comments`: String
- `budgetCode`: String
- `status`: String (Enum: Draft, PendingApproval, Approved, Rejected, PartiallyReceived, Closed, Cancelled)
- `closedDate`: Date
- `closedBy`: String (Reference to User)
- `closureReason`: String
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `poId` (unique)
- `tenantId`
- `poNumber` (unique)
- `poDate`
- `vendorId`
- `status`
- `departmentId`

### Vendor
Represents vendor master.

**Fields:**
- `vendorId`: String (UUID)
- `tenantId`: String
- `vendorCode`: String (Unique)
- `vendorName`: String
- `vendorType`: String (Enum: Supplier, ServiceProvider, Contractor, Consultant)
- `category`: Array of Strings
- `contactPerson`: Object
  - `name`: String
  - `designation`: String
  - `mobile`: String
  - `email`: String
- `address`: Object
  - `street`: String
  - `city`: String
  - `state`: String
  - `pincode`: String
  - `country`: String
- `taxDetails`: Object
  - `panNumber`: String
  - `gstNumber`: String
  - `tanNumber`: String
- `bankDetails`: Object
  - `accountNumber`: String
  - `bankName`: String
  - `ifscCode`: String
  - `branch`: String
- `paymentTerms`: String
- `creditLimit`: Number
- `creditPeriod`: Number (in days)
- `documents`: Array of Objects
  - `documentType`: String (Enum: GST, PAN, Cancelled Cheque, Contract, Other)
  - `documentUrl`: String
- `rating`: Number (0-5)
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `vendorId` (unique)
- `tenantId`
- `vendorCode` (unique)
- `vendorType`
- `category`
- `isActive`

### Bill
Represents bills and invoices.

**Fields:**
- `billId`: String (UUID)
- `tenantId`: String
- `billNumber`: String
- `billDate`: Date
- `vendorId`: String (Reference to Vendor)
- `purchaseOrderId`: String (Reference to PurchaseOrder)
- `billType`: String (Enum: Goods, Services, Utility, Salary, Other)
- `departmentId`: String
- `lineItems`: Array of Objects
  - `description`: String
  - `quantity`: Number
  - `unitPrice`: Number
  - `taxRate`: Number
  - `taxAmount`: Number
  - `totalAmount`: Number
  - `accountId`: String (Reference to Account)
- `subtotal`: Number
- `taxTotal`: Number
- `otherCharges`: Number
- `totalAmount`: Number
- `paymentTerms`: String
- `dueDate`: Date
- `attachments`: Array of Strings
- `remarks`: String
- `approvedBy`: String (Reference to User)
- `approvedDate`: Date
- `status`: String (Enum: Pending, Approved, Paid, Overdue, Cancelled)
- `paidAmount`: Number
- `balanceAmount`: Number
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `billId` (unique)
- `tenantId`
- `vendorId`
- `billDate`
- `status`
- `dueDate`

### Payment
Represents payment records.

**Fields:**
- `paymentId`: String (UUID)
- `tenantId`: String
- `paymentDate`: Date
- `paymentMode`: String (Enum: Cash, Cheque, NEFT, RTGS, IMPS, UPI)
- `paymentType`: String (Enum: Vendor, Salary, Utility, Tax, Other)
- `payeeId`: String
- `payeeName`: String
- `bills`: Array of Objects
  - `billId`: String (Reference to Bill)
  - `billAmount`: Number
  - `paidAmount`: Number
- `totalAmount`: Number
- `bankAccountId`: String (Reference to BankAccount)
- `chequeNumber`: String
- `chequeDate`: Date
- `transactionId`: String
- `tdsApplicable`: Boolean
- `tdsAmount`: Number
- `netPayment`: Number
- `remarks`: String
- `processedBy`: String (Reference to User)
- `approvedBy`: String (Reference to User)
- `status`: String (Enum: Pending, Processed, Failed, Cancelled)
- `voucherNumber`: String
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `paymentId` (unique)
- `tenantId`
- `paymentDate`
- `paymentMode`
- `paymentType`
- `status`
- `payeeId`

## Payroll Module

### SalaryStructure
Represents salary structure master.

**Fields:**
- `salaryStructureId`: String (UUID)
- `tenantId`: String
- `structureName`: String
- `designation`: String
- `grade`: String
- `effectiveFrom`: Date
- `components`: Object
  - `earnings`: Array of Objects
    - `componentName`: String
    - `componentType`: String (Enum: Fixed, Allowance)
    - `amount`: Number
    - `percentage`: Number
    - `calculationType`: String (Enum: Fixed, PercentageOfBasic, Formula)
    - `isStatutory`: Boolean
    - `isTaxable`: Boolean
  - `deductions`: Array of Objects
    - `componentName`: String
    - `percentage`: Number
    - `amount`: Number
    - `calculationType`: String (Enum: Fixed, PercentageOfBasic, PercentageOfGross)
    - `isStatutory`: Boolean
    - `employerContribution`: Number
- `ctc`: Number
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `salaryStructureId` (unique)
- `tenantId`
- `designation`
- `isActive`
- `effectiveFrom`

### EmployeeSalary
Represents employee salary assignments.

**Fields:**
- `employeeSalaryId`: String (UUID)
- `tenantId`: String
- `employeeId`: String
- `salaryStructureId`: String (Reference to SalaryStructure)
- `effectiveFrom`: Date
- `customComponents`: Array of Objects
  - `componentName`: String
  - `amount`: Number
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `employeeSalaryId` (unique)
- `tenantId`
- `employeeId`
- `salaryStructureId`
- `isActive`

### SalaryProcessing
Represents monthly salary processing batches.

**Fields:**
- `salaryProcessingId`: String (UUID)
- `tenantId`: String
- `batchId`: String
- `month`: Number (1-12)
- `year`: Number
- `departmentId`: String
- `employeeIds`: Array of Strings
- `totalEmployees`: Number
- `totalGross`: Number
- `totalDeductions`: Number
- `totalNet`: Number
- `attendanceAdjustment`: Boolean
- `leavesAdjustment`: Boolean
- `remarks`: String
- `status`: String (Enum: Pending, Processing, Completed, Failed)
- `processedBy`: String (Reference to User)
- `processedDate`: Date
- `disbursementDate`: Date
- `disbursementMode`: String (Enum: BankTransfer, Cheque, Cash)
- `bankAccountId`: String (Reference to BankAccount)
- `disbursementStatus`: String (Enum: Pending, Initiated, Completed, Failed)
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `salaryProcessingId` (unique)
- `tenantId`
- `batchId`
- `month`
- `year`
- `status`
- `processedBy`

### SalarySlip
Represents individual salary slips.

**Fields:**
- `salarySlipId`: String (UUID)
- `tenantId`: String
- `employeeId`: String
- `processingId`: String (Reference to SalaryProcessing)
- `employeeName`: String
- `designation`: String
- `employeeCode`: String
- `department`: String
- `month`: Number (1-12)
- `year`: Number
- `payDays`: Number
- `lop`: Number
- `earnings`: Array of Objects
  - `componentName`: String
  - `amount`: Number
- `grossEarnings`: Number
- `deductions`: Array of Objects
  - `componentName`: String
  - `amount`: Number
- `totalDeductions`: Number
- `netPay`: Number
- `paymentMode`: String
- `accountNumber`: String
- `ifscCode`: String
- `bankName`: String
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `salarySlipId` (unique)
- `tenantId`
- `employeeId`
- `month`
- `year`
- `processingId`

### PayrollCompliance
Represents compliance tracking.

**Fields:**
- `payrollComplianceId`: String (UUID)
- `tenantId`: String
- `employeeId`: String
- `complianceType`: String (Enum: PF, ESI, TDS, ProfessionalTax, IncomeTax)
- `financialYear`: String
- `month`: Number (1-12)
- `year`: Number
- `amount`: Number
- `employerContribution`: Number
- `referenceNumber`: String
- `challanNumber`: String
- `challanDate`: Date
- `dueDate`: Date
- `paymentDate`: Date
- `status`: String (Enum: Pending, Submitted, Paid, Overdue)
- `remarks`: String
- `documents`: Array of Objects
  - `documentType`: String
  - `documentUrl`: String
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `payrollComplianceId` (unique)
- `tenantId`
- `employeeId`
- `complianceType`
- `financialYear`
- `status`

### Form16
Represents Form 16 data.

**Fields:**
- `form16Id`: String (UUID)
- `tenantId`: String
- `employeeId`: String
- `financialYear`: String
- `employeeName`: String
- `employeeCode`: String
- `panNumber`: String
- `employerName`: String
- `employerTAN`: String
- `salaryDetails`: Object
  - `grossSalary`: Number
  - `exemptedAllowances`: Number
  - `hraExemption`: Number
  - `otherExemptions`: Number
  - `totalExemptions`: Number
  - `taxableSalary`: Number
- `taxDetails`: Object
  - `taxOnTotalIncome`: Number
  - `rebateUnder87A`: Number
  - `taxAfterRebate`: Number
  - `educationCess`: Number
  - `totalTaxPayable`: Number
  - `reliefUnder89`: Number
  - `netTaxPayable`: Number
- `tdsDetails`: Object
  - `tdsDeposited`: Array of Objects
    - `quarter`: String
    - `amount`: Number
    - `date`: Date
    - `challanNumber`: String
  - `totalTDS`: Number
- `otherDetails`: Object
  - `taxDeductionCertificate`: String
  - `remarks`: String
- `form16Url`: String
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `form16Id` (unique)
- `tenantId`
- `employeeId`
- `financialYear`
- `panNumber`

## Tax Module

### GSTTransaction
Represents GST transactions.

**Fields:**
- `gstTransactionId`: String (UUID)
- `tenantId`: String
- `transactionType`: String (Enum: Sale, Purchase)
- `invoiceNumber`: String
- `invoiceDate`: Date
- `partyGSTIN`: String
- `partyName`: String
- `placeOfSupply`: String
- `taxableAmount`: Number
- `cgst`: Number
- `sgst`: Number
- `igst`: Number
- `totalGST`: Number
- `totalAmount`: Number
- `reverseCharge`: Boolean
- `invoiceType`: String (Enum: Regular, Export, Import, SEZ)
- `hsnCode`: String
- `sacCode`: String
- `description`: String
- `financialYear`: String
- `quarter`: String (Enum: Q1, Q2, Q3, Q4)
- `gstr1FilingStatus`: String (Enum: Pending, Filed, NotRequired)
- `gstr1FilingDate`: Date
- `gstr3bFilingStatus`: String (Enum: Pending, Filed, NotRequired)
- `gstr3bFilingDate`: Date
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `gstTransactionId` (unique)
- `tenantId`
- `invoiceDate`
- `transactionType`
- `financialYear`
- `quarter`
- `partyGSTIN`

### TDSDeduction
Represents TDS deduction records.

**Fields:**
- `tdsDeductionId`: String (UUID)
- `tenantId`: String
- `deducteeId`: String
- `deducteeName`: String
- `deducteePAN`: String
- `section`: String (Enum: 192, 194A, 194C, 194H, 194I, 194J, 194IA, 194IB, 194IC, 194ID, 194IE, 194N, Other)
- `paymentDate`: Date
- `grossAmount`: Number
- `tdsRate`: Number
- `tdsAmount`: Number
- `netAmount`: Number
- `quarter`: String (Enum: Q1, Q2, Q3, Q4)
- `financialYear`: String
- `certificateIssued`: Boolean
- `certificateIssueDate`: Date
- `form16AIssued`: Boolean
- `form26QStatus`: String (Enum: Pending, Filed, NotRequired)
- `form26QFilingDate`: Date
- `remarks`: String
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `tdsDeductionId` (unique)
- `tenantId`
- `paymentDate`
- `financialYear`
- `quarter`
- `deducteePAN`
- `section`

### TaxCompliance
Represents tax compliance tracking.

**Fields:**
- `taxComplianceId`: String (UUID)
- `tenantId`: String
- `taxType`: String (Enum: IncomeTax, GST, TDS, TCS, ProfessionalTax, WealthTax)
- `financialYear`: String
- `quarter`: String (Enum: Q1, Q2, Q3, Q4, Annual)
- `dueDate`: Date
- `filingDate`: Date
- `amountPayable`: Number
- `amountPaid`: Number
- `balanceAmount`: Number
- `status`: String (Enum: Pending, Overdue, Filed, Paid, Cancelled)
- `formType`: String
- `referenceNumber`: String
- `challanNumber`: String
- `challanDate`: Date
- `documents`: Array of Objects
  - `documentType`: String
  - `documentUrl`: String
- `remarks`: String
- `notifiedTo`: Array of Strings (References to Users)
- `notificationDate`: Date
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `taxComplianceId` (unique)
- `tenantId`
- `taxType`
- `financialYear`
- `status`
- `dueDate`

## Reports Module

### FinancialStatement
Represents generated financial statements.

**Fields:**
- `financialStatementId`: String (UUID)
- `tenantId`: String
- `statementType`: String (Enum: IncomeStatement, BalanceSheet, CashFlow, TrialBalance)
- `period`: Object
  - `startDate`: Date
  - `endDate`: Date
- `asOfDate`: Date
- `financialYear`: String
- `data`: Mixed
- `includeComparative`: Boolean
- `comparativeData`: Mixed
- `departmentWise`: Boolean
- `format`: String (Enum: pdf, xlsx, json)
- `fileUrl`: String
- `generatedBy`: String (Reference to User)
- `generationDate`: Date
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `financialStatementId` (unique)
- `tenantId`
- `statementType`
- `financialYear`
- `generationDate`

### AuditTrail
Represents audit trail logs.

**Fields:**
- `auditTrailId`: String (UUID)
- `tenantId`: String
- `userId`: String (Reference to User)
- `userName`: String
- `actionType`: String (Enum: Create, Update, Delete, Read, Login, Logout, FailedLogin)
- `moduleName`: String
- `entityName`: String
- `entityId`: String
- `ipAddress`: String
- `userAgent`: String
- `requestData`: Mixed
- `responseData`: Mixed
- `timestamp`: Date
- `isActive`: Boolean

**Indexes:**
- `auditTrailId` (unique)
- `tenantId`
- `userId`
- `actionType`
- `moduleName`
- `timestamp`
- `entityName`
- `entityId`

## Integrations Module

### BankAccount
Represents bank account details.

**Fields:**
- `bankAccountId`: String (UUID)
- `tenantId`: String
- `accountName`: String
- `accountNumber`: String
- `accountType`: String (Enum: Savings, Current, FixedDeposit, RecurringDeposit)
- `bankName`: String
- `branchName`: String
- `ifscCode`: String
- `micrCode`: String
- `swiftCode`: String
- `accountHolderName`: String
- `openingBalance`: Number
- `currentBalance`: Number
- `currency`: String (Default: INR)
- `isPrimary`: Boolean
- `isActive`: Boolean
- `integrationDetails`: Object
  - `provider`: String (Enum: Razorpay, ICICI, HDFC, Axis, Other)
  - `apiKey`: String
  - `webhookUrl`: String
  - `lastSyncDate`: Date
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `bankAccountId` (unique)
- `tenantId`
- `accountNumber`
- `bankName`
- `isActive`
- `isPrimary`

### PaymentGateway
Represents payment gateway configuration.

**Fields:**
- `paymentGatewayId`: String (UUID)
- `tenantId`: String
- `gatewayName`: String
- `provider`: String (Enum: Razorpay, Stripe, PayPal, CCAvenue, PayU, Other)
- `merchantId`: String
- `apiKey`: String
- `apiSecret`: String
- `webhookSecret`: String
- `webhookUrl`: String
- `isActive`: Boolean
- `supportedCurrencies`: Array of Strings
- `transactionFee`: Number
- `configuration`: Mixed
- `lastSyncDate`: Date
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `paymentGatewayId` (unique)
- `tenantId`
- `provider`
- `isActive`

### Webhook
Represents webhook registrations.

**Fields:**
- `webhookId`: String (UUID)
- `tenantId`: String
- `url`: String
- `events`: Array of Strings (Enum: payment.received, payment.failed, invoice.generated, budget.exceeded, bill.approved, salary.processed, po.approved, reconciliation.completed)
- `secret`: String
- `isActive`: Boolean
- `retryAttempts`: Number (Default: 3)
- `timeout`: Number (Default: 5000, in milliseconds)
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**
- `webhookId` (unique)
- `tenantId`
- `isActive`
- `events`

## Relationships
The following relationships exist between collections:

1. **Account** ←→ **JournalEntry.lineItems.accountId**
2. **Account** ←→ **Transaction.accountId**
3. **Account** ←→ **BudgetLine.accountId**
4. **Account** ←→ **FeeStructure.components.accountId**
5. **Account** ←→ **PurchaseOrder.items.accountId**
6. **Account** ←→ **Bill.lineItems.accountId**
7. **Account** ←→ **SalaryStructure.components.earnings.accountId**
8. **Account** ←→ **SalaryStructure.components.deductions.accountId**

9. **JournalEntry** ←→ **Transaction.journalEntryId**
10. **JournalEntry** ←→ **JournalEntry.lineItems.accountId**

11. **Budget** ←→ **BudgetLine.budgetId**
12. **Budget** ←→ **BudgetRevision.budgetId**
13. **Budget** ←→ **BudgetAlert.budgetId**

14. **FeeStructure** ←→ **FeeInvoice.feeStructureId**
15. **FeeInvoice** ←→ **FeePayment.invoiceId**
16. **FeePayment** ←→ **FeeRefund.paymentId**
17. **Scholarship** ←→ **ScholarshipApplication.scholarshipId**
18. **ScholarshipApplication** ←→ **ScholarshipDisbursement.applicationId**

19. **Vendor** ←→ **PurchaseOrder.vendorId**
20. **Vendor** ←→ **Bill.vendorId**
21. **PurchaseOrder** ←→ **Bill.purchaseOrderId**

22. **SalaryStructure** ←→ **EmployeeSalary.salaryStructureId**
23. **EmployeeSalary** ←→ **SalaryProcessing.employeeIds**
24. **SalaryProcessing** ←→ **SalarySlip.processingId**
25. **Employee** ←→ **PayrollCompliance.employeeId**
26. **Employee** ←→ **Form16.employeeId**

27. **BankAccount** ←→ **Payment.bankAccountId**

28. **User** ←→ **JournalEntry.createdBy**
29. **User** ←→ **Budget.preparedBy**
30. **User** ←→ **FeePayment.receivedBy**
31. **User** ←→ **PurchaseOrder.preparedBy**
32. **User** ←→ **Bill.approvedBy**
33. **User** ←→ **SalaryProcessing.processedBy**
34. **User** ←→ **SalarySlip.employeeId**
35. **User** ←→ **PayrollCompliance.employeeId**
36. **User** ←→ **Form16.employeeId**
37. **User** ←→ **GSTTransaction.partyId**
38. **User** ←→ **TDSDeduction.deducteeId**
39. **User** ←→ **FinancialStatement.generatedBy**
40. **User** ←→ **AuditTrail.userId**
41. **User** ←→ **BudgetAlert.recipients**