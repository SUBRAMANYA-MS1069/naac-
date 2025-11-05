const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const feeRefundSchema = new mongoose.Schema({
  feeRefundId: {
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
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  paymentId: {
    type: String,
    required: true,
    ref: 'FeePayment'
  },
  refundAmount: {
    type: Number,
    required: true
  },
  refundReason: {
    type: String,
    required: true,
    trim: true
  },
  refundMode: {
    type: String,
    required: true,
    enum: ['Cash', 'Cheque', 'BankTransfer']
  },
  bankDetails: {
    accountNumber: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true
    },
    accountHolderName: {
      type: String,
      trim: true
    }
  },
  approvedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  approvedDate: {
    type: Date,
    default: Date.now
  },
  refundDate: {
    type: Date
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Processed', 'Rejected'],
    default: 'Pending'
  },
  remarks: {
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
feeRefundSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
feeRefundSchema.index({ tenantId: 1, studentId: 1 });
feeRefundSchema.index({ tenantId: 1, status: 1 });
feeRefundSchema.index({ tenantId: 1, refundDate: 1 });

module.exports = mongoose.model('FeeRefund', feeRefundSchema);