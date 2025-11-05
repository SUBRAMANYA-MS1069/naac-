const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const budgetLineSchema = new mongoose.Schema({
  budgetLineId: {
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
  budgetId: {
    type: String,
    required: true,
    ref: 'Budget'
  },
  accountId: {
    type: String,
    required: true,
    ref: 'Account'
  },
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  budgetCategory: {
    type: String,
    required: true,
    enum: ['Income', 'Expense']
  },
  quarters: [{
    quarter: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  totalBudget: {
    type: Number,
    required: true,
    default: 0
  },
  notes: {
    type: String,
    trim: true
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
budgetLineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
budgetLineSchema.index({ tenantId: 1, budgetId: 1 });
budgetLineSchema.index({ tenantId: 1, accountId: 1 });
budgetLineSchema.index({ tenantId: 1, budgetCategory: 1 });

module.exports = mongoose.model('BudgetLine', budgetLineSchema);