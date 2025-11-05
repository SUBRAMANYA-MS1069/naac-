const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const billSchema = new mongoose.Schema({
  billId: {
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
  billNumber: {
    type: String,
    required: true,
    trim: true
  },
  billDate: {
    type: Date,
    required: true
  },
  vendorId: {
    type: String,
    required: true,
    ref: 'Vendor'
  },
  purchaseOrderId: {
    type: String,
    ref: 'PurchaseOrder'
  },
  billType: {
    type: String,
    required: true,
    enum: ['Goods', 'Services', 'Utility', 'Salary', 'Other']
  },
  departmentId: {
    type: String,
    ref: 'Department'
  },
  lineItems: [{
    description: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    },
    taxRate: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    accountId: {
      type: String,
      ref: 'Account'
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  taxTotal: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  attachments: [{
    type: String
  }],
  remarks: {
    type: String,
    trim: true
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
    enum: ['Pending', 'Approved', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number
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
billSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate balance amount before saving
billSchema.pre('save', function(next) {
  this.balanceAmount = this.totalAmount - this.paidAmount;
  next();
});

// Index for efficient querying
billSchema.index({ tenantId: 1, vendorId: 1 });
billSchema.index({ tenantId: 1, billDate: 1 });
billSchema.index({ tenantId: 1, status: 1 });
billSchema.index({ tenantId: 1, dueDate: 1 });

module.exports = mongoose.model('Bill', billSchema);