const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const feePaymentSchema = new mongoose.Schema({
  feePaymentId: {
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
  invoiceId: {
    type: String,
    required: true,
    ref: 'FeeInvoice'
  },
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['Cash', 'Cheque', 'DD', 'NetBanking', 'UPI', 'Card', 'OnlinePaymentGateway']
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  chequeNumber: {
    type: String,
    trim: true
  },
  chequeDate: {
    type: Date
  },
  remarks: {
    type: String,
    trim: true
  },
  receivedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  allocations: [{
    feeComponent: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Pending'],
    default: 'Success'
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
feePaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
feePaymentSchema.index({ tenantId: 1, studentId: 1 });
feePaymentSchema.index({ tenantId: 1, invoiceId: 1 });
feePaymentSchema.index({ tenantId: 1, paymentDate: 1 });
feePaymentSchema.index({ tenantId: 1, paymentMode: 1 });
feePaymentSchema.index({ tenantId: 1, transactionId: 1 });

module.exports = mongoose.model('FeePayment', feePaymentSchema);