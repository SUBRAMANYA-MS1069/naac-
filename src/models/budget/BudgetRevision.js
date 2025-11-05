const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const budgetRevisionSchema = new mongoose.Schema({
  budgetRevisionId: {
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
  revisionNumber: {
    type: Number,
    required: true
  },
  revisionDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  changes: [{
    accountId: {
      type: String,
      required: true,
      ref: 'Account'
    },
    oldAmount: {
      type: Number,
      required: true
    },
    newAmount: {
      type: Number,
      required: true
    },
    justification: {
      type: String,
      required: true,
      trim: true
    }
  }],
  requestedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  approvedBy: {
    type: String,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
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
budgetRevisionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
budgetRevisionSchema.index({ tenantId: 1, budgetId: 1 });
budgetRevisionSchema.index({ tenantId: 1, status: 1 });
budgetRevisionSchema.index({ tenantId: 1, revisionDate: 1 });

module.exports = mongoose.model('BudgetRevision', budgetRevisionSchema);