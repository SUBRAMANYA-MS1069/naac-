# NAAC Financial & Administrative Module - API Documentation

## Overview
This documentation covers all API endpoints for the Financial & Administrative module of the NAAC Compliance System. All endpoints are secured with JWT authentication and follow REST conventions.

## Base URL
```
/api/v1/finance
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses
All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": [],
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
}
```

## Success Responses
All success responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

## Financial Accounts Management

### Create Account
```
POST /accounts
```
**Request Body:**
```json
{
  "accountCode": "string",
  "accountName": "string",
  "accountType": "Asset|Liability|Equity|Revenue|Expense",
  "accountCategory": "CurrentAsset|FixedAsset|CurrentLiability|LongTermLiability|Income|DirectExpense|IndirectExpense",
  "parentAccountId": "string",
  "description": "string",
  "openingBalance": 0,
  "openingBalanceDate": "ISO8601",
  "currency": "INR",
  "isActive": true,
  "taxApplicable": false,
  "gstRate": 0
}
```

### Get All Accounts
```
GET /accounts
```
**Query Parameters:**
- `type` (string, optional)
- `category` (string, optional)
- `active` (boolean, default: true)
- `search` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Account by ID
```
GET /accounts/:accountId
```

### Update Account
```
PUT /accounts/:accountId
```

### Get Account Balance
```
GET /accounts/:accountId/balance
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

## Journal Entries Management

### Create Journal Entry
```
POST /journal-entries
```
**Request Body:**
```json
{
  "entryNumber": "JE-2024-00123",
  "entryDate": "ISO8601",
  "entryType": "Journal|Payment|Receipt|ContraEntry|Adjustment",
  "referenceNumber": "string",
  "description": "string",
  "lineItems": [
    {
      "accountId": "string",
      "debit": 50000,
      "credit": 0,
      "description": "string",
      "costCenterId": "string",
      "projectId": "string"
    }
  ],
  "attachments": ["url"],
  "approvalRequired": true
}
```

### Get Journal Entries
```
GET /journal-entries
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `status` (enum: Draft|Pending|Posted|Rejected)
- `entryType` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Journal Entry by ID
```
GET /journal-entries/:entryId
```

### Update Journal Entry
```
PUT /journal-entries/:entryId
```

### Post Journal Entry
```
POST /journal-entries/:entryId/post
```
**Request Body:**
```json
{
  "postDate": "ISO8601"
}
```

### Reverse Journal Entry
```
POST /journal-entries/:entryId/reverse
```
**Request Body:**
```json
{
  "reversalDate": "ISO8601",
  "reason": "string"
}
```

## Financial Statements

### Get Trial Balance
```
GET /trial-balance
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

### Get Account Ledger
```
GET /ledger/:accountId
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)

### Get Balance Sheet
```
GET /balance-sheet
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

### Get Income Statement
```
GET /income-statement
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)

## Budget Management

### Create Budget
```
POST /budgets
```
**Request Body:**
```json
{
  "budgetName": "string",
  "financialYear": "string",
  "budgetType": "Annual|Quarterly|Project|Department",
  "startDate": "ISO8601",
  "endDate": "ISO8601",
  "departmentId": "string",
  "budgetLines": [
    {
      "accountId": "string",
      "accountName": "string",
      "budgetCategory": "Income|Expense",
      "quarters": [
        {
          "quarter": 1,
          "amount": 100000
        }
      ],
      "notes": "string"
    }
  ],
  "assumptions": ["string"]
}
```

### Get Budgets
```
GET /budgets
```
**Query Parameters:**
- `status` (enum: Draft|Submitted|Approved|Active|Rejected|Closed)
- `financialYear` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Budget by ID
```
GET /budgets/:budgetId
```

### Update Budget
```
PUT /budgets/:budgetId
```

### Submit Budget for Approval
```
POST /budgets/:budgetId/submit
```
**Request Body:**
```json
{
  "submittedBy": "userId",
  "submittedDate": "ISO8601"
}
```

### Approve Budget
```
POST /budgets/:budgetId/approve
```
**Request Body:**
```json
{
  "approvedBy": "userId",
  "approvedDate": "ISO8601"
}
```

### Activate Budget
```
POST /budgets/:budgetId/activate
```

### Close Budget
```
POST /budgets/:budgetId/close
```
**Request Body:**
```json
{
  "closedBy": "userId",
  "closedDate": "ISO8601",
  "closureReason": "string"
}
```

## Budget Monitoring

### Get Budget vs Actuals
```
GET /budgets/:budgetId/actuals
```

### Get Quarterly Utilization
```
GET /budgets/:budgetId/quarterly-utilization
```

### Get Budget Summary
```
GET /budgets/:budgetId/summary
```

### Create Budget Alert
```
POST /budgets/:budgetId/alerts
```
**Request Body:**
```json
{
  "alertType": "ThresholdReached|QuarterlyReview|MonthEnd",
  "threshold": 80,
  "accountIds": ["accountId"],
  "recipients": ["userId"],
  "frequency": "Daily|Weekly|Monthly"
}
```

### Get Budget Alerts
```
GET /budgets/:budgetId/alerts
```

### Update Budget Alert
```
PUT /budgets/alerts/:alertId
```

### Delete Budget Alert
```
DELETE /budgets/alerts/:alertId
```

## Fee Structure Management

### Create Fee Structure
```
POST /fees/structures
```
**Request Body:**
```json
{
  "structureName": "string",
  "academicYear": "string",
  "programId": "string",
  "semester": "string",
  "feeType": "Tuition|Admission|Examination|Library|Laboratory|Hostel|Transport|Other",
  "studentCategory": "General|SC/ST|OBC|EWS|International",
  "components": [
    {
      "componentName": "string",
      "amount": 50000,
      "isMandatory": true,
      "isRefundable": false,
      "taxApplicable": false,
      "accountId": "string"
    }
  ],
  "paymentSchedule": [
    {
      "installmentNumber": 1,
      "dueDate": "ISO8601",
      "amount": 25000
    }
  ],
  "lateFeePolicy": {
    "gracePeriodDays": 0,
    "lateFeePerDay": 0,
    "maxLateFee": 0
  },
  "discounts": [
    {
      "discountName": "string",
      "discountType": "Percentage|Fixed",
      "discountValue": 10,
      "eligibilityCriteria": "string"
    }
  ],
  "effectiveFrom": "ISO8601",
  "effectiveTo": "ISO8601"
}
```

### Get Fee Structures
```
GET /fees/structures
```
**Query Parameters:**
- `active` (boolean, default: true)
- `academicYear` (string, optional)
- `programId` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Fee Structure by ID
```
GET /fees/structures/:structureId
```

### Update Fee Structure
```
PUT /fees/structures/:structureId
```

### Delete Fee Structure
```
DELETE /fees/structures/:structureId
```

## Fee Collection

### Generate Fee Invoice
```
POST /fees/invoices
```
**Request Body:**
```json
{
  "studentId": "string",
  "feeStructureId": "string",
  "academicYear": "string",
  "semester": "string",
  "dueDate": "ISO8601",
  "discountsApplied": [
    {
      "discountId": "string",
      "discountAmount": 5000,
      "reason": "string"
    }
  ],
  "adjustments": [
    {
      "description": "string",
      "amount": 1000,
      "reason": "string"
    }
  ],
  "remarks": "string"
}
```

### Get Invoices
```
GET /fees/invoices
```
**Query Parameters:**
- `studentId` (string, optional)
- `academicYear` (string, optional)
- `status` (enum: Pending|PartiallyPaid|Paid|Overdue|Cancelled)
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Invoice by ID
```
GET /fees/invoices/:invoiceId
```

### Update Invoice
```
PUT /fees/invoices/:invoiceId
```

### Record Fee Payment
```
POST /fees/payments
```
**Request Body:**
```json
{
  "invoiceId": "string",
  "studentId": "string",
  "paymentDate": "ISO8601",
  "paymentMode": "Cash|Cheque|DD|NetBanking|UPI|Card|OnlinePaymentGateway",
  "amount": 50000,
  "transactionId": "string",
  "bankName": "string",
  "chequeNumber": "string",
  "chequeDate": "ISO8601",
  "remarks": "string",
  "allocations": [
    {
      "feeComponent": "string",
      "amount": 25000
    }
  ]
}
```

### Get Payments
```
GET /fees/payments
```
**Query Parameters:**
- `studentId` (string, optional)
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Payment by ID
```
GET /fees/payments/:paymentId
```

## Scholarship Management

### Create Scholarship
```
POST /fees/scholarships
```
**Request Body:**
```json
{
  "scholarshipName": "string",
  "scholarshipType": "Merit|NeedBased|Sports|Cultural|Government|Private",
  "sponsorName": "string",
  "academicYear": "string",
  "eligibilityCriteria": {
    "minimumCGPA": 8.0,
    "familyIncome": {
      "max": 500000
    },
    "category": ["General", "OBC"],
    "otherCriteria": ["string"]
  },
  "benefitType": "FullTuitionWaiver|PartialTuitionWaiver|Stipend|FeeReduction",
  "benefitAmount": 50000,
  "benefitPercentage": 50,
  "totalSlots": 100,
  "applicationStartDate": "ISO8601",
  "applicationEndDate": "ISO8601",
  "selectionProcess": "string",
  "documents": ["string"]
}
```

### Get Scholarships
```
GET /fees/scholarships
```
**Query Parameters:**
- `active` (boolean, default: true)
- `academicYear` (string, optional)
- `scholarshipType` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Scholarship by ID
```
GET /fees/scholarships/:scholarshipId
```

### Update Scholarship
```
PUT /fees/scholarships/:scholarshipId
```

### Delete Scholarship
```
DELETE /fees/scholarships/:scholarshipId
```

### Apply for Scholarship
```
POST /fees/scholarships/:scholarshipId/applications
```
**Request Body:**
```json
{
  "studentId": "string",
  "cgpa": 8.5,
  "familyIncome": 400000,
  "category": "General",
  "supportingDocuments": [
    {
      "documentType": "IncomeCertificate|Marksheet|BankStatement|Other",
      "documentUrl": "string"
    }
  ],
  "reasonForApplication": "string"
}
```

### Get Scholarship Applications
```
GET /fees/scholarships/:scholarshipId/applications
```

### Update Scholarship Application
```
PUT /fees/scholarships/applications/:applicationId
```
**Request Body:**
```json
{
  "status": "Pending|UnderReview|Approved|Rejected",
  "approvedAmount": 50000,
  "approvedBy": "userId",
  "approvedDate": "ISO8601",
  "comments": "string"
}
```

## Purchase Order Management

### Create Purchase Order
```
POST /expenditure/purchase-orders
```
**Request Body:**
```json
{
  "poNumber": "string",
  "poDate": "ISO8601",
  "vendorId": "string",
  "departmentId": "string",
  "requisitionId": "string",
  "poType": "Goods|Services|Both",
  "deliveryDate": "ISO8601",
  "deliveryLocation": "string",
  "items": [
    {
      "itemDescription": "string",
      "quantity": 10,
      "unit": "string",
      "unitPrice": 5000,
      "taxRate": 18,
      "specifications": "string",
      "accountId": "string"
    }
  ],
  "paymentTerms": "string",
  "deliveryTerms": "string",
  "warrantyDetails": "string",
  "specialInstructions": "string",
  "budgetCode": "string"
}
```

### Get Purchase Orders
```
GET /expenditure/purchase-orders
```
**Query Parameters:**
- `vendorId` (string, optional)
- `status` (enum: Draft|PendingApproval|Approved|Rejected|PartiallyReceived|Closed|Cancelled)
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Purchase Order by ID
```
GET /expenditure/purchase-orders/:poId
```

### Update Purchase Order
```
PUT /expenditure/purchase-orders/:poId
```

### Approve Purchase Order
```
POST /expenditure/purchase-orders/:poId/approve
```
**Request Body:**
```json
{
  "approverId": "userId",
  "comments": "string"
}
```

### Close Purchase Order
```
POST /expenditure/purchase-orders/:poId/close
```
**Request Body:**
```json
{
  "closedBy": "userId",
  "closedDate": "ISO8601",
  "closureReason": "string"
}
```

## Vendor Management

### Create Vendor
```
POST /expenditure/vendors
```
**Request Body:**
```json
{
  "vendorCode": "string",
  "vendorName": "string",
  "vendorType": "Supplier|ServiceProvider|Contractor|Consultant",
  "category": ["string"],
  "contactPerson": {
    "name": "string",
    "designation": "string",
    "mobile": "string",
    "email": "string"
  },
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "country": "string"
  },
  "taxDetails": {
    "panNumber": "string",
    "gstNumber": "string",
    "tanNumber": "string"
  },
  "bankDetails": {
    "accountNumber": "string",
    "bankName": "string",
    "ifscCode": "string",
    "branch": "string"
  },
  "paymentTerms": "string",
  "creditLimit": 1000000,
  "creditPeriod": 30,
  "documents": [
    {
      "documentType": "GST|PAN|Cancelled Cheque|Contract|Other",
      "documentUrl": "string"
    }
  ]
}
```

### Get Vendors
```
GET /expenditure/vendors
```
**Query Parameters:**
- `active` (boolean, default: true)
- `vendorType` (string, optional)
- `category` (string, optional)
- `search` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Vendor by ID
```
GET /expenditure/vendors/:vendorId
```

### Update Vendor
```
PUT /expenditure/vendors/:vendorId
```

### Delete Vendor
```
DELETE /expenditure/vendors/:vendorId
```

## Bill Management

### Create Bill
```
POST /expenditure/bills
```
**Request Body:**
```json
{
  "billNumber": "string",
  "billDate": "ISO8601",
  "vendorId": "string",
  "purchaseOrderId": "string",
  "billType": "Goods|Services|Utility|Salary|Other",
  "departmentId": "string",
  "lineItems": [
    {
      "description": "string",
      "quantity": 10,
      "unitPrice": 5000,
      "taxRate": 18,
      "accountId": "string"
    }
  ],
  "paymentTerms": "string",
  "dueDate": "ISO8601",
  "attachments": ["string"],
  "remarks": "string"
}
```

### Get Bills
```
GET /expenditure/bills
```
**Query Parameters:**
- `vendorId` (string, optional)
- `status` (enum: Pending|Approved|Paid|Overdue|Cancelled)
- `billType` (string, optional)
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Bill by ID
```
GET /expenditure/bills/:billId
```

### Update Bill
```
PUT /expenditure/bills/:billId
```

### Approve Bill
```
POST /expenditure/bills/:billId/approve
```
**Request Body:**
```json
{
  "approvedBy": "userId"
}
```

### Record Bill Payment
```
POST /expenditure/bills/:billId/pay
```
**Request Body:**
```json
{
  "paymentDate": "ISO8601",
  "paymentMode": "Cash|Cheque|NEFT|RTGS|IMPS|UPI",
  "amount": 50000,
  "bankAccountId": "string",
  "chequeNumber": "string",
  "chequeDate": "ISO8601",
  "transactionId": "string",
  "tdsApplicable": false,
  "tdsAmount": 0,
  "remarks": "string"
}
```

## Salary Structure Management

### Create Salary Structure
```
POST /payroll/salary-structures
```
**Request Body:**
```json
{
  "structureName": "string",
  "designation": "string",
  "grade": "string",
  "effectiveFrom": "ISO8601",
  "components": {
    "earnings": [
      {
        "componentName": "string",
        "componentType": "Fixed|Allowance",
        "amount": 50000,
        "percentage": 0,
        "calculationType": "Fixed|PercentageOfBasic|Formula",
        "isStatutory": false,
        "isTaxable": true
      }
    ],
    "deductions": [
      {
        "componentName": "string",
        "percentage": 12,
        "amount": 0,
        "calculationType": "Fixed|PercentageOfBasic|PercentageOfGross",
        "isStatutory": true,
        "employerContribution": 5000
      }
    ]
  }
}
```

### Get Salary Structures
```
GET /payroll/salary-structures
```
**Query Parameters:**
- `active` (boolean, default: true)
- `designation` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Salary Structure by ID
```
GET /payroll/salary-structures/:structureId
```

### Update Salary Structure
```
PUT /payroll/salary-structures/:structureId
```

### Delete Salary Structure
```
DELETE /payroll/salary-structures/:structureId
```

## Salary Processing

### Process Monthly Salary
```
POST /payroll/process-salary
```
**Request Body:**
```json
{
  "month": 10,
  "year": 2023,
  "departmentId": "string",
  "employeeIds": ["string"],
  "attendanceAdjustment": false,
  "leavesAdjustment": false,
  "remarks": "string"
}
```

### Get Salary Processing Batches
```
GET /payroll/salary-batches
```
**Query Parameters:**
- `status` (enum: Pending|Processing|Completed|Failed)
- `month` (number, optional)
- `year` (number, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get Salary Processing Batch by ID
```
GET /payroll/salary-batches/:batchId
```

### Generate Salary Slips
```
POST /payroll/salary-batches/:batchId/generate-slips
```

### Get Employee Salary Slip
```
GET /payroll/salary-slips/:employeeId
```
**Query Parameters:**
- `month` (number)
- `year` (number)

### Disburse Salary
```
POST /payroll/salary-batches/:batchId/disburse
```
**Request Body:**
```json
{
  "disbursementDate": "ISO8601",
  "disbursementMode": "BankTransfer|Cheque|Cash",
  "bankAccountId": "string"
}
```

## Payroll Compliance

### Get Compliance Records
```
GET /payroll/compliance
```
**Query Parameters:**
- `complianceType` (enum: PF|ESI|TDS|ProfessionalTax|IncomeTax)
- `financialYear` (string, optional)
- `status` (enum: Pending|Submitted|Paid|Overdue)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Update Compliance Status
```
PUT /payroll/compliance/:complianceId
```
**Request Body:**
```json
{
  "status": "Pending|Submitted|Paid|Overdue",
  "paymentDate": "ISO8601",
  "referenceNumber": "string",
  "challanNumber": "string",
  "remarks": "string"
}
```

### Generate Form 16
```
POST /payroll/compliance/generate-form16
```
**Request Body:**
```json
{
  "employeeId": "string",
  "financialYear": "string"
}
```

## GST Management

### Create GST Transaction
```
POST /tax/gst-transactions
```
**Request Body:**
```json
{
  "transactionType": "Sale|Purchase",
  "invoiceNumber": "string",
  "invoiceDate": "ISO8601",
  "partyGSTIN": "string",
  "partyName": "string",
  "placeOfSupply": "string",
  "taxableAmount": 100000,
  "gstRate": 18,
  "invoiceType": "Regular|Export|Import|SEZ",
  "hsnCode": "string",
  "sacCode": "string",
  "description": "string",
  "financialYear": "string",
  "quarter": "Q1|Q2|Q3|Q4"
}
```

### Get GST Transactions
```
GET /tax/gst-transactions
```
**Query Parameters:**
- `transactionType` (string, optional)
- `financialYear` (string, optional)
- `quarter` (string, optional)
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get GST Transaction by ID
```
GET /tax/gst-transactions/:transactionId
```

### Update GST Transaction
```
PUT /tax/gst-transactions/:transactionId
```

### Update GSTR1 Filing Status
```
POST /tax/gst-transactions/:transactionId/gstr1-status
```
**Request Body:**
```json
{
  "status": "Pending|Filed|NotRequired",
  "filingDate": "ISO8601"
}
```

### Update GSTR3B Filing Status
```
POST /tax/gst-transactions/:transactionId/gstr3b-status
```
**Request Body:**
```json
{
  "status": "Pending|Filed|NotRequired",
  "filingDate": "ISO8601"
}
```

## TDS Management

### Create TDS Deduction
```
POST /tax/tds-deductions
```
**Request Body:**
```json
{
  "deducteeId": "string",
  "deducteeName": "string",
  "deducteePAN": "string",
  "section": "192|194A|194C|194H|194I|194J|194IA|194IB|194IC|194ID|194IE|194N|Other",
  "paymentDate": "ISO8601",
  "grossAmount": 100000,
  "tdsRate": 10,
  "quarter": "Q1|Q2|Q3|Q4",
  "financialYear": "string",
  "remarks": "string"
}
```

### Get TDS Deductions
```
GET /tax/tds-deductions
```
**Query Parameters:**
- `section` (string, optional)
- `financialYear` (string, optional)
- `quarter` (string, optional)
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Get TDS Deduction by ID
```
GET /tax/tds-deductions/:deductionId
```

### Update TDS Deduction
```
PUT /tax/tds-deductions/:deductionId
```

### Issue TDS Certificate
```
POST /tax/tds-deductions/:deductionId/issue-certificate
```
**Request Body:**
```json
{
  "certificateIssueDate": "ISO8601"
}
```

### Update Form 26Q Status
```
POST /tax/tds-deductions/:deductionId/form26q-status
```
**Request Body:**
```json
{
  "status": "Pending|Filed|NotRequired",
  "filingDate": "ISO8601"
}
```

## Financial Reports

### Get Trial Balance
```
GET /reports/trial-balance
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

### Get Balance Sheet
```
GET /reports/balance-sheet
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

### Get Income Statement
```
GET /reports/income-statement
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)

### Get Cash Flow Statement
```
GET /reports/cash-flow
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)

### Export Financial Statement
```
GET /reports/export
```
**Query Parameters:**
- `format` (enum: pdf|xlsx|json, default: pdf)

## Management Reports

### Get Budget vs Actual Report
```
GET /reports/budget-vs-actual
```
**Query Parameters:**
- `financialYear` (string, optional)
- `departmentId` (string, optional)

### Get Expense Analysis Report
```
GET /reports/expense-analysis
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `category` (string, optional)

### Get Revenue Analysis Report
```
GET /reports/revenue-analysis
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `source` (string, optional)

### Get Financial Ratios Report
```
GET /reports/financial-ratios
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

### Export Management Report
```
GET /reports/management-export
```
**Query Parameters:**
- `format` (enum: pdf|xlsx|json, default: pdf)

## Audit Reports

### Get Transaction Audit Trail
```
GET /reports/audit-trail
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `userId` (string, optional)

### Get User Activity Log
```
GET /reports/user-activity
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `userId` (string, optional)

### Get Compliance Report
```
GET /reports/compliance
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `complianceType` (string, optional)

### Generate Audit Report
```
POST /reports/generate-audit-report
```
**Request Body:**
```json
{
  "reportType": "string",
  "startDate": "ISO8601",
  "endDate": "ISO8601",
  "format": "pdf|xlsx|json"
}
```

## Financial Analytics

### Get Liquidity Ratios
```
GET /analytics/liquidity-ratios
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

### Get Profitability Ratios
```
GET /analytics/profitability-ratios
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)

### Get Efficiency Ratios
```
GET /analytics/efficiency-ratios
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)

### Get Leverage Ratios
```
GET /analytics/leverage-ratios
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)

### Get Comprehensive Analysis
```
GET /analytics/comprehensive-analysis
```
**Query Parameters:**
- `asOfDate` (ISO8601, optional)
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)

## Dashboard

### Get Financial Dashboard
```
GET /analytics/dashboard
```

### Get Budget Dashboard
```
GET /analytics/budget-dashboard
```

### Get Receivables Dashboard
```
GET /analytics/receivables-dashboard
```

### Get Payables Dashboard
```
GET /analytics/payables-dashboard
```

## Integrations

### Sync with Accounting Software
```
POST /integrations/accounting-software/sync
```

### Get Accounting Software Integration Status
```
GET /integrations/accounting-software/status
```

### Configure Accounting Software Integration
```
POST /integrations/accounting-software/configure
```
**Request Body:**
```json
{
  "provider": "Tally|Razorpay|Other",
  "apiKey": "string"
}
```

### Export Data to Accounting Software
```
POST /integrations/accounting-software/export
```

### Get Bank Account Balances
```
GET /integrations/banking/balances
```

### Sync Bank Transactions
```
POST /integrations/banking/sync-transactions
```

### Get Bank Integration Status
```
GET /integrations/banking/status
```

### Configure Bank Integration
```
POST /integrations/banking/configure
```
**Request Body:**
```json
{
  "bankName": "string",
  "apiKey": "string"
}
```

### Get Payment Gateway Status
```
GET /integrations/payment-gateway/status
```

### Configure Payment Gateway
```
POST /integrations/payment-gateway/configure
```
**Request Body:**
```json
{
  "provider": "Razorpay|Stripe|PayPal|CCAvenue|PayU|Other",
  "merchantId": "string",
  "apiKey": "string"
}
```

### Get Payment Transactions
```
GET /integrations/payment-gateway/transactions
```
**Query Parameters:**
- `startDate` (ISO8601, optional)
- `endDate` (ISO8601, optional)
- `status` (string, optional)

### Process Refund
```
POST /integrations/payment-gateway/refund
```
**Request Body:**
```json
{
  "transactionId": "string",
  "amount": 5000,
  "reason": "string"
}
```