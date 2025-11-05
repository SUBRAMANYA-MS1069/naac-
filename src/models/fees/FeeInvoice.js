const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const feeInvoiceSchema = new mongoose.Schema({
  feeInvoiceId: {
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
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  feeStructureId: {
    type: String,
    required: true,
    ref: 'FeeStructure'
  },
  academicYear: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discountsApplied: [{
    discountId: {
      type: String,
      ref: 'Discount'
    },
    discountAmount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      trim: true
    }
  }],
  adjustments: [{
    description: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      trim: true
    }
  }],
  finalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'PartiallyPaid', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  remarks: {
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
feeInvoiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
feeInvoiceSchema.index({ tenantId: 1, studentId: 1 });
feeInvoiceSchema.index({ tenantId: 1, academicYear: 1 });
feeInvoiceSchema.index({ tenantId: 1, status: 1 });
feeInvoiceSchema.index({ tenantId: 1, dueDate: 1 });

module.exports = mongoose.model('FeeInvoice', feeInvoiceSchema);