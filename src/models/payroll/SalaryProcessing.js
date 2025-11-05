const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const salaryProcessingSchema = new mongoose.Schema({
  salaryProcessingId: {
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
  batchId: {
    type: String,
    required: true,
    index: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  departmentId: {
    type: String,
    ref: 'Department'
  },
  employeeIds: [{
    type: String,
    ref: 'Employee'
  }],
  totalEmployees: {
    type: Number,
    required: true
  },
  totalGross: {
    type: Number,
    required: true
  },
  totalDeductions: {
    type: Number,
    required: true
  },
  totalNet: {
    type: Number,
    required: true
  },
  attendanceAdjustment: {
    type: Boolean,
    default: false
  },
  leavesAdjustment: {
    type: Boolean,
    default: false
  },
  remarks: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed'],
    default: 'Pending'
  },
  processedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  processedDate: {
    type: Date
  },
  disbursementDate: {
    type: Date
  },
  disbursementMode: {
    type: String,
    enum: ['BankTransfer', 'Cheque', 'Cash']
  },
  bankAccountId: {
    type: String,
    ref: 'BankAccount'
  },
  disbursementStatus: {
    type: String,
    enum: ['Pending', 'Initiated', 'Completed', 'Failed']
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
salaryProcessingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
salaryProcessingSchema.index({ tenantId: 1, batchId: 1 });
salaryProcessingSchema.index({ tenantId: 1, month: 1, year: 1 });
salaryProcessingSchema.index({ tenantId: 1, status: 1 });
salaryProcessingSchema.index({ tenantId: 1, processedBy: 1 });

module.exports = mongoose.model('SalaryProcessing', salaryProcessingSchema);