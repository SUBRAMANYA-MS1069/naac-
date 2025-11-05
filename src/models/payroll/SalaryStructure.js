const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const salaryStructureSchema = new mongoose.Schema({
  salaryStructureId: {
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
  structureName: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    trim: true
  },
  effectiveFrom: {
    type: Date,
    required: true
  },
  components: {
    earnings: [{
      componentName: {
        type: String,
        required: true,
        trim: true
      },
      componentType: {
        type: String,
        required: true,
        enum: ['Fixed', 'Allowance']
      },
      amount: {
        type: Number,
        default: 0
      },
      percentage: {
        type: Number
      },
      calculationType: {
        type: String,
        enum: ['Fixed', 'PercentageOfBasic', 'Formula']
      },
      isStatutory: {
        type: Boolean,
        default: false
      },
      isTaxable: {
        type: Boolean,
        default: true
      }
    }],
    deductions: [{
      componentName: {
        type: String,
        required: true,
        trim: true
      },
      percentage: {
        type: Number
      },
      amount: {
        type: Number
      },
      calculationType: {
        type: String,
        enum: ['Fixed', 'PercentageOfBasic', 'PercentageOfGross']
      },
      isStatutory: {
        type: Boolean,
        default: false
      },
      employerContribution: {
        type: Number
      }
    }]
  },
  ctc: {
    type: Number,
    required: true
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
salaryStructureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
salaryStructureSchema.index({ tenantId: 1, designation: 1 });
salaryStructureSchema.index({ tenantId: 1, isActive: 1 });
salaryStructureSchema.index({ tenantId: 1, effectiveFrom: 1 });

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);