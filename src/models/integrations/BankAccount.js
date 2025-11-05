const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bankAccountSchema = new mongoose.Schema({
  bankAccountId: {
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
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Savings', 'Current', 'FixedDeposit', 'RecurringDeposit']
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  branchName: {
    type: String,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true
  },
  micrCode: {
    type: String,
    trim: true
  },
  swiftCode: {
    type: String,
    trim: true
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  openingBalance: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  integrationDetails: {
    provider: {
      type: String,
      enum: ['Razorpay', 'ICICI', 'HDFC', 'Axis', 'Other']
    },
    apiKey: {
      type: String
    },
    webhookUrl: {
      type: String
    },
    lastSyncDate: {
      type: Date
    }
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
bankAccountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
bankAccountSchema.index({ tenantId: 1, accountNumber: 1 });
bankAccountSchema.index({ tenantId: 1, bankName: 1 });
bankAccountSchema.index({ tenantId: 1, isActive: 1 });
bankAccountSchema.index({ tenantId: 1, isPrimary: 1 });

module.exports = mongoose.model('BankAccount', bankAccountSchema);