const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gstTransactionSchema = new mongoose.Schema({
  gstTransactionId: {
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
  transactionType: {
    type: String,
    required: true,
    enum: ['Sale', 'Purchase']
  },
  invoiceNumber: {
    type: String,
    required: true,
    trim: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  partyGSTIN: {
    type: String,
    required: true,
    trim: true
  },
  partyName: {
    type: String,
    required: true,
    trim: true
  },
  placeOfSupply: {
    type: String,
    required: true,
    trim: true
  },
  taxableAmount: {
    type: Number,
    required: true
  },
  cgst: {
    type: Number,
    required: true
  },
  sgst: {
    type: Number,
    required: true
  },
  igst: {
    type: Number,
    required: true
  },
  totalGST: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  reverseCharge: {
    type: Boolean,
    default: false
  },
  invoiceType: {
    type: String,
    required: true,
    enum: ['Regular', 'Export', 'Import', 'SEZ']
  },
  hsnCode: {
    type: String,
    trim: true
  },
  sacCode: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  quarter: {
    type: String,
    required: true,
    enum: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  gstr1FilingStatus: {
    type: String,
    enum: ['Pending', 'Filed', 'NotRequired'],
    default: 'Pending'
  },
  gstr1FilingDate: {
    type: Date
  },
  gstr3bFilingStatus: {
    type: String,
    enum: ['Pending', 'Filed', 'NotRequired'],
    default: 'Pending'
  },
  gstr3bFilingDate: {
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
gstTransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
gstTransactionSchema.index({ tenantId: 1, invoiceDate: 1 });
gstTransactionSchema.index({ tenantId: 1, transactionType: 1 });
gstTransactionSchema.index({ tenantId: 1, financialYear: 1 });
gstTransactionSchema.index({ tenantId: 1, quarter: 1 });
gstTransactionSchema.index({ tenantId: 1, partyGSTIN: 1 });

module.exports = mongoose.model('GSTTransaction', gstTransactionSchema);