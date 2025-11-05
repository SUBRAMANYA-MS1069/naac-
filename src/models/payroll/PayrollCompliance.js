const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const payrollComplianceSchema = new mongoose.Schema({
  payrollComplianceId: {
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
  complianceType: {
    type: String,
    required: true,
    enum: ['PF', 'ESI', 'TDS', 'ProfessionalTax', 'IncomeTax']
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  year: {
    type: Number
  },
  amount: {
    type: Number,
    required: true
  },
  employerContribution: {
    type: Number
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
  dueDate: {
    type: Date
  },
  paymentDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Paid', 'Overdue'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    trim: true
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
payrollComplianceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
payrollComplianceSchema.index({ tenantId: 1, employeeId: 1 });
payrollComplianceSchema.index({ tenantId: 1, complianceType: 1 });
payrollComplianceSchema.index({ tenantId: 1, financialYear: 1 });
payrollComplianceSchema.index({ tenantId: 1, status: 1 });

module.exports = mongoose.model('PayrollCompliance', payrollComplianceSchema);