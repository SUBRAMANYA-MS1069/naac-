const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const feeStructureSchema = new mongoose.Schema({
  feeStructureId: {
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
  academicYear: {
    type: String,
    required: true,
    trim: true
  },
  programId: {
    type: String,
    ref: 'Program'
  },
  semester: {
    type: String,
    trim: true
  },
  feeType: {
    type: String,
    required: true,
    enum: ['Tuition', 'Admission', 'Examination', 'Library', 'Laboratory', 'Hostel', 'Transport', 'Other']
  },
  studentCategory: {
    type: String,
    enum: ['General', 'SC/ST', 'OBC', 'EWS', 'International']
  },
  components: [{
    componentName: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    },
    isMandatory: {
      type: Boolean,
      default: true
    },
    isRefundable: {
      type: Boolean,
      default: false
    },
    taxApplicable: {
      type: Boolean,
      default: false
    },
    accountId: {
      type: String,
      ref: 'Account'
    }
  }],
  totalFee: {
    type: Number,
    required: true
  },
  paymentSchedule: [{
    installmentNumber: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  lateFeePolicy: {
    gracePeriodDays: {
      type: Number,
      default: 0
    },
    lateFeePerDay: {
      type: Number,
      default: 0
    },
    maxLateFee: {
      type: Number,
      default: 0
    }
  },
  discounts: [{
    discountName: {
      type: String,
      required: true,
      trim: true
    },
    discountType: {
      type: String,
      required: true,
      enum: ['Percentage', 'Fixed']
    },
    discountValue: {
      type: Number,
      required: true
    },
    eligibilityCriteria: {
      type: String,
      trim: true
    }
  }],
  effectiveFrom: {
    type: Date,
    required: true
  },
  effectiveTo: {
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
feeStructureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
feeStructureSchema.index({ tenantId: 1, academicYear: 1 });
feeStructureSchema.index({ tenantId: 1, programId: 1 });
feeStructureSchema.index({ tenantId: 1, feeType: 1 });
feeStructureSchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);