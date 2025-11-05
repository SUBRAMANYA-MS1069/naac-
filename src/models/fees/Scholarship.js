const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const scholarshipSchema = new mongoose.Schema({
  scholarshipId: {
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
  scholarshipName: {
    type: String,
    required: true,
    trim: true
  },
  scholarshipType: {
    type: String,
    required: true,
    enum: ['Merit', 'NeedBased', 'Sports', 'Cultural', 'Government', 'Private']
  },
  sponsorName: {
    type: String,
    trim: true
  },
  academicYear: {
    type: String,
    required: true,
    trim: true
  },
  eligibilityCriteria: {
    minimumCGPA: {
      type: Number,
      default: 0
    },
    familyIncome: {
      max: {
        type: Number
      }
    },
    category: [{
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS']
    }],
    otherCriteria: [{
      type: String
    }]
  },
  benefitType: {
    type: String,
    required: true,
    enum: ['FullTuitionWaiver', 'PartialTuitionWaiver', 'Stipend', 'FeeReduction']
  },
  benefitAmount: {
    type: Number
  },
  benefitPercentage: {
    type: Number
  },
  totalSlots: {
    type: Number,
    required: true
  },
  applicationStartDate: {
    type: Date,
    required: true
  },
  applicationEndDate: {
    type: Date,
    required: true
  },
  selectionProcess: {
    type: String,
    trim: true
  },
  documents: [{
    type: String
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
scholarshipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
scholarshipSchema.index({ tenantId: 1, academicYear: 1 });
scholarshipSchema.index({ tenantId: 1, scholarshipType: 1 });
scholarshipSchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);