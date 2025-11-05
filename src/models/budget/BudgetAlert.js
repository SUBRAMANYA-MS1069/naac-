const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const budgetAlertSchema = new mongoose.Schema({
  budgetAlertId: {
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
  alertType: {
    type: String,
    required: true,
    enum: ['ThresholdReached', 'QuarterlyReview', 'MonthEnd']
  },
  threshold: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  accountIds: [{
    type: String,
    ref: 'Account'
  }],
  recipients: [{
    type: String,
    ref: 'User'
  }],
  frequency: {
    type: String,
    required: true,
    enum: ['Daily', 'Weekly', 'Monthly']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastSent: {
    type: Date
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
budgetAlertSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
budgetAlertSchema.index({ tenantId: 1, budgetId: 1 });
budgetAlertSchema.index({ tenantId: 1, alertType: 1 });
budgetAlertSchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('BudgetAlert', budgetAlertSchema);