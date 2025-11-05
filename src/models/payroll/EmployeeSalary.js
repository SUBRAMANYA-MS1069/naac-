const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const employeeSalarySchema = new mongoose.Schema({
  employeeSalaryId: {
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
  salaryStructureId: {
    type: String,
    required: true,
    ref: 'SalaryStructure'
  },
  effectiveFrom: {
    type: Date,
    required: true
  },
  customComponents: [{
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
employeeSalarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
employeeSalarySchema.index({ tenantId: 1, employeeId: 1 });
employeeSalarySchema.index({ tenantId: 1, salaryStructureId: 1 });
employeeSalarySchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('EmployeeSalary', employeeSalarySchema);