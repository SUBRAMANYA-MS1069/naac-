const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const accountSchema = new mongoose.Schema({
  accountId: {
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
  accountCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']
  },
  accountCategory: {
    type: String,
    required: true,
    enum: ['CurrentAsset', 'FixedAsset', 'CurrentLiability', 'LongTermLiability', 'Income', 'DirectExpense', 'IndirectExpense']
  },
  parentAccountId: {
    type: String,
    ref: 'Account',
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  openingBalance: {
    type: Number,
    default: 0
  },
  openingBalanceDate: {
    type: Date,
    default: null
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  taxApplicable: {
    type: Boolean,
    default: false
  },
  gstRate: {
    type: Number,
    default: 0
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
accountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
accountSchema.index({ tenantId: 1, accountType: 1 });
accountSchema.index({ tenantId: 1, accountCategory: 1 });
accountSchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('Account', accountSchema);