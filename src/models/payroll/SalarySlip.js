const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const salarySlipSchema = new mongoose.Schema({
  salarySlipId: {
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
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  processingId: {
    type: String,
    required: true,
    ref: 'SalaryProcessing'
  },
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  employeeCode: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
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
  payDays: {
    type: Number,
    required: true
  },
  lop: {
    type: Number,
    default: 0
  },
  earnings: [{
    componentName: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  grossEarnings: {
    type: Number,
    required: true
  },
  deductions: [{
    componentName: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  totalDeductions: {
    type: Number,
    required: true
  },
  netPay: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    trim: true
  },
  accountNumber: {
    type: String,
    trim: true
  },
  ifscCode: {
    type: String,
    trim: true
  },
  bankName: {
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
salarySlipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
salarySlipSchema.index({ tenantId: 1, employeeId: 1 });
salarySlipSchema.index({ tenantId: 1, month: 1, year: 1 });
salarySlipSchema.index({ tenantId: 1, processingId: 1 });

module.exports = mongoose.model('SalarySlip', salarySlipSchema);