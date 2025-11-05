const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const financialYearSchema = new mongoose.Schema({
  financialYearId: {
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
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  closingStatus: {
    type: String,
    enum: ['Open', 'Closed', 'Archived'],
    default: 'Open'
  },
  notes: {
    type: String,
    trim: true
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
financialYearSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
financialYearSchema.index({ tenantId: 1, isCurrent: 1 });
financialYearSchema.index({ tenantId: 1, isActive: 1 });
financialYearSchema.index({ tenantId: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('FinancialYear', financialYearSchema);