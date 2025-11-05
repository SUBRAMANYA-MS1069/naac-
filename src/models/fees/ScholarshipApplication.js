const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const scholarshipApplicationSchema = new mongoose.Schema({
  scholarshipApplicationId: {
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
  scholarshipId: {
    type: String,
    required: true,
    ref: 'Scholarship'
  },
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  applicationDate: {
    type: Date,
    required: true
  },
  cgpa: {
    type: Number,
    required: true
  },
  familyIncome: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS']
  },
  supportingDocuments: [{
    documentType: {
      type: String,
      required: true,
      enum: ['IncomeCertificate', 'Marksheet', 'BankStatement', 'Other']
    },
    documentUrl: {
      type: String,
      required: true
    }
  }],
  reasonForApplication: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'UnderReview', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedAmount: {
    type: Number
  },
  approvedBy: {
    type: String,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  comments: {
    type: String,
    trim: true
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
scholarshipApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
scholarshipApplicationSchema.index({ tenantId: 1, scholarshipId: 1 });
scholarshipApplicationSchema.index({ tenantId: 1, studentId: 1 });
scholarshipApplicationSchema.index({ tenantId: 1, status: 1 });
scholarshipApplicationSchema.index({ tenantId: 1, applicationDate: 1 });

module.exports = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);