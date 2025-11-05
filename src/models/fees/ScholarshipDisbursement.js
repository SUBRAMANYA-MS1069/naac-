const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const scholarshipDisbursementSchema = new mongoose.Schema({
  scholarshipDisbursementId: {
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
  applicationId: {
    type: String,
    required: true,
    ref: 'ScholarshipApplication'
  },
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  amount: {
    type: Number,
    required: true
  },
  disbursementDate: {
    type: Date,
    required: true
  },
  disbursementMode: {
    type: String,
    required: true,
    enum: ['DirectFeeWaiver', 'BankTransfer', 'Cheque']
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  disbursedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Failed'],
    default: 'Pending'
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
scholarshipDisbursementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
scholarshipDisbursementSchema.index({ tenantId: 1, studentId: 1 });
scholarshipDisbursementSchema.index({ tenantId: 1, applicationId: 1 });
scholarshipDisbursementSchema.index({ tenantId: 1, disbursementDate: 1 });
scholarshipDisbursementSchema.index({ tenantId: 1, status: 1 });

module.exports = mongoose.model('ScholarshipDisbursement', scholarshipDisbursementSchema);