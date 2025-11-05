const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const financialStatementSchema = new mongoose.Schema({
  financialStatementId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true,
    index: true
  },
  tenantId: {
    type: String,
    required: true,
    index: true,
    ref: 'Tenant'
  },
  statementType: {
    type: String,
    required: true,
    enum: ['IncomeStatement', 'BalanceSheet', 'CashFlow', 'TrialBalance']
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  asOfDate: {
    type: Date
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  includeComparative: {
    type: Boolean,
    default: false
  },
  comparativeData: {
    type: mongoose.Schema.Types.Mixed
  },
  departmentWise: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    enum: ['pdf', 'xlsx', 'json'],
    default: 'pdf'
  },
  fileUrl: {
    type: String
  },
  generatedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  generationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
financialStatementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
financialStatementSchema.index({ tenantId: 1, statementType: 1 });
financialStatementSchema.index({ tenantId: 1, financialYear: 1 });
financialStatementSchema.index({ tenantId: 1, generationDate: 1 });

module.exports = mongoose.model('FinancialStatement', financialStatementSchema);