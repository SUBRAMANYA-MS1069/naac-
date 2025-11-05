const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const form16Schema = new mongoose.Schema({
  form16Id: {
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
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  employeeCode: {
    type: String,
    trim: true
  },
  panNumber: {
    type: String,
    required: true,
    trim: true
  },
  employerName: {
    type: String,
    required: true,
    trim: true
  },
  employerTAN: {
    type: String,
    required: true,
    trim: true
  },
  salaryDetails: {
    grossSalary: {
      type: Number,
      required: true
    },
    exemptedAllowances: {
      type: Number,
      default: 0
    },
    hraExemption: {
      type: Number,
      default: 0
    },
    otherExemptions: {
      type: Number,
      default: 0
    },
    totalExemptions: {
      type: Number,
      default: 0
    },
    taxableSalary: {
      type: Number,
      required: true
    }
  },
  taxDetails: {
    taxOnTotalIncome: {
      type: Number,
      required: true
    },
    rebateUnder87A: {
      type: Number,
      default: 0
    },
    taxAfterRebate: {
      type: Number,
      required: true
    },
    educationCess: {
      type: Number,
      required: true
    },
    totalTaxPayable: {
      type: Number,
      required: true
    },
    reliefUnder89: {
      type: Number,
      default: 0
    },
    netTaxPayable: {
      type: Number,
      required: true
    }
  },
  tdsDetails: {
    tdsDeposited: [{
      quarter: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      challanNumber: {
        type: String,
        required: true
      }
    }],
    totalTDS: {
      type: Number,
      required: true
    }
  },
  otherDetails: {
    taxDeductionCertificate: {
      type: String
    },
    remarks: {
      type: String,
      trim: true
    }
  },
  form16Url: {
    type: String
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
form16Schema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
form16Schema.index({ tenantId: 1, employeeId: 1 });
form16Schema.index({ tenantId: 1, financialYear: 1 });
form16Schema.index({ tenantId: 1, panNumber: 1 });

module.exports = mongoose.model('Form16', form16Schema);