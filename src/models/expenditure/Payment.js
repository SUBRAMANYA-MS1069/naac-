const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
  paymentId: {
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
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['Cash', 'Cheque', 'NEFT', 'RTGS', 'IMPS', 'UPI']
  },
  paymentType: {
    type: String,
    required: true,
    enum: ['Vendor', 'Salary', 'Utility', 'Tax', 'Other']
  },
  payeeId: {
    type: String,
    required: true
  },
  payeeName: {
    type: String,
    required: true,
    trim: true
  },
  bills: [{
    billId: {
      type: String,
      ref: 'Bill'
    },
    billAmount: {
      type: Number,
      required: true
    },
    paidAmount: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  bankAccountId: {
    type: String,
    ref: 'BankAccount'
  },
  chequeNumber: {
    type: String,
    trim: true
  },
  chequeDate: {
    type: Date
  },
  transactionId: {
    type: String,
    trim: true
  },
  tdsApplicable: {
    type: Boolean,
    default: false
  },
  tdsAmount: {
    type: Number,
    default: 0
  },
  netPayment: {
    type: Number,
    required: true
  },
  remarks: {
    type: String,
    trim: true
  },
  processedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  approvedBy: {
    type: String,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  voucherNumber: {
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
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
paymentSchema.index({ tenantId: 1, paymentDate: 1 });
paymentSchema.index({ tenantId: 1, paymentMode: 1 });
paymentSchema.index({ tenantId: 1, paymentType: 1 });
paymentSchema.index({ tenantId: 1, status: 1 });
paymentSchema.index({ tenantId: 1, payeeId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);