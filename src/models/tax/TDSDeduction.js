const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tdsDeductionSchema = new mongoose.Schema({
  tdsDeductionId: {
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
  deducteeId: {
    type: String,
    required: true
  },
  deducteeName: {
    type: String,
    required: true,
    trim: true
  },
  deducteePAN: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    required: true,
    enum: ['192', '194A', '194C', '194H', '194I', '194J', '194IA', '194IB', '194IC', '194ID', '194IE', '194N', 'Other']
  },
  paymentDate: {
    type: Date,
    required: true
  },
  grossAmount: {
    type: Number,
    required: true
  },
  tdsRate: {
    type: Number,
    required: true
  },
  tdsAmount: {
    type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: true
  },
  quarter: {
    type: String,
    required: true,
    enum: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssueDate: {
    type: Date
  },
  form16AIssued: {
    type: Boolean,
    default: false
  },
  form26QStatus: {
    type: String,
    enum: ['Pending', 'Filed', 'NotRequired'],
    default: 'Pending'
  },
  form26QFilingDate: {
    type: Date
  },
  remarks: {
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
tdsDeductionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
tdsDeductionSchema.index({ tenantId: 1, paymentDate: 1 });
tdsDeductionSchema.index({ tenantId: 1, financialYear: 1 });
tdsDeductionSchema.index({ tenantId: 1, quarter: 1 });
tdsDeductionSchema.index({ tenantId: 1, deducteePAN: 1 });
tdsDeductionSchema.index({ tenantId: 1, section: 1 });

module.exports = mongoose.model('TDSDeduction', tdsDeductionSchema);