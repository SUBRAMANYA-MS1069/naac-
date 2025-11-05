const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema({
  transactionId: {
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
  accountId: {
    type: String,
    required: true,
    ref: 'Account'
  },
  journalEntryId: {
    type: String,
    required: true,
    ref: 'JournalEntry'
  },
  transactionDate: {
    type: Date,
    required: true
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['Debit', 'Credit']
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  referenceId: {
    type: String,
    trim: true
  },
  referenceType: {
    type: String,
    trim: true
  },
  balanceAfterTransaction: {
    type: Number,
    required: true
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
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
transactionSchema.index({ tenantId: 1, accountId: 1, transactionDate: 1 });
transactionSchema.index({ tenantId: 1, journalEntryId: 1 });
transactionSchema.index({ tenantId: 1, transactionDate: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);