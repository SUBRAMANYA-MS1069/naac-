const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const taxComplianceSchema = new mongoose.Schema({
  taxComplianceId: {
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
  taxType: {
    type: String,
    required: true,
    enum: ['IncomeTax', 'GST', 'TDS', 'TCS', 'ProfessionalTax', 'WealthTax']
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4', 'Annual']
  },
  dueDate: {
    type: Date,
    required: true
  },
  filingDate: {
    type: Date
  },
  amountPayable: {
    type: Number
  },
  amountPaid: {
    type: Number
  },
  balanceAmount: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Overdue', 'Filed', 'Paid', 'Cancelled'],
    default: 'Pending'
  },
  formType: {
    type: String,
    trim: true
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  challanNumber: {
    type: String,
    trim: true
  },
  challanDate: {
    type: Date
  },
  documents: [{
    documentType: {
      type: String,
      trim: true
    },
    documentUrl: {
      type: String
    }
  }],
  remarks: {
    type: String,
    trim: true
  },
  notifiedTo: [{
    type: String,
    ref: 'User'
  }],
  notificationDate: {
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
taxComplianceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate balance amount before saving
taxComplianceSchema.pre('save', function(next) {
  if (this.amountPayable && this.amountPaid) {
    this.balanceAmount = this.amountPayable - this.amountPaid;
  }
  next();
});

// Index for efficient querying
taxComplianceSchema.index({ tenantId: 1, taxType: 1 });
taxComplianceSchema.index({ tenantId: 1, financialYear: 1 });
taxComplianceSchema.index({ tenantId: 1, status: 1 });
taxComplianceSchema.index({ tenantId: 1, dueDate: 1 });

module.exports = mongoose.model('TaxCompliance', taxComplianceSchema);