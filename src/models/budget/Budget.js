const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const budgetSchema = new mongoose.Schema({
  budgetId: {
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
  budgetName: {
    type: String,
    required: true,
    trim: true
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  budgetType: {
    type: String,
    required: true,
    enum: ['Annual', 'Quarterly', 'Project', 'Department']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  departmentId: {
    type: String,
    ref: 'Department'
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Active', 'Rejected', 'Closed'],
    default: 'Draft'
  },
  totalIncome: {
    type: Number,
    default: 0
  },
  totalExpense: {
    type: Number,
    default: 0
  },
  netBudget: {
    type: Number,
    default: 0
  },
  assumptions: [{
    type: String
  }],
  preparedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  reviewers: [{
    type: String,
    ref: 'User'
  }],
  approvedBy: {
    type: String,
    ref: 'User'
  },
  approvedDate: {
    type: Date
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
budgetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
budgetSchema.index({ tenantId: 1, financialYear: 1 });
budgetSchema.index({ tenantId: 1, status: 1 });
budgetSchema.index({ tenantId: 1, departmentId: 1 });
budgetSchema.index({ tenantId: 1, budgetType: 1 });

module.exports = mongoose.model('Budget', budgetSchema);