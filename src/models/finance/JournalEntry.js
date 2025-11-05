const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const journalEntrySchema = new mongoose.Schema({
  journalEntryId: {
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
  entryNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  entryDate: {
    type: Date,
    required: true
  },
  entryType: {
    type: String,
    required: true,
    enum: ['Journal', 'Payment', 'Receipt', 'ContraEntry', 'Adjustment']
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  lineItems: [{
    accountId: {
      type: String,
      required: true,
      ref: 'Account'
    },
    debit: {
      type: Number,
      default: 0
    },
    credit: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true
    },
    costCenterId: {
      type: String,
      ref: 'CostCenter'
    },
    projectId: {
      type: String,
      ref: 'Project'
    }
  }],
  totalDebit: {
    type: Number,
    default: 0
  },
  totalCredit: {
    type: Number,
    default: 0
  },
  attachments: [{
    type: String
  }],
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  approvalRequired: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: String,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Posted', 'Rejected', 'Reversed'],
    default: 'Draft'
  },
  postedDate: {
    type: Date
  },
  postedBy: {
    type: String,
    ref: 'User'
  },
  reversalDate: {
    type: Date
  },
  reversalReason: {
    type: String,
    trim: true
  },
  reversedBy: {
    type: String,
    ref: 'User'
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
journalEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
journalEntrySchema.index({ tenantId: 1, entryDate: 1 });
journalEntrySchema.index({ tenantId: 1, status: 1 });
journalEntrySchema.index({ tenantId: 1, entryType: 1 });
journalEntrySchema.index({ tenantId: 1, createdBy: 1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);