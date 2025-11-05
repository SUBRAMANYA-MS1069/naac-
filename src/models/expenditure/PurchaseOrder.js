const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const purchaseOrderSchema = new mongoose.Schema({
  poId: {
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
  poNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  poDate: {
    type: Date,
    required: true
  },
  vendorId: {
    type: String,
    required: true,
    ref: 'Vendor'
  },
  departmentId: {
    type: String,
    ref: 'Department'
  },
  requisitionId: {
    type: String,
    ref: 'Requisition'
  },
  poType: {
    type: String,
    required: true,
    enum: ['Goods', 'Services', 'Both']
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryLocation: {
    type: String,
    required: true,
    trim: true
  },
  items: [{
    itemDescription: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      trim: true
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
    specifications: {
      type: String,
      trim: true
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
  shippingCharges: {
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
  deliveryTerms: {
    type: String,
    trim: true
  },
  warrantyDetails: {
    type: String,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  preparedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  approvers: [{
    userId: {
      type: String,
      ref: 'User'
    },
    approved: {
      type: Boolean,
      default: false
    },
    approvedDate: {
      type: Date
    },
    comments: {
      type: String,
      trim: true
    }
  }],
  budgetCode: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'PendingApproval', 'Approved', 'Rejected', 'PartiallyReceived', 'Closed', 'Cancelled'],
    default: 'Draft'
  },
  closedDate: {
    type: Date
  },
  closedBy: {
    type: String,
    ref: 'User'
  },
  closureReason: {
    type: String,
    trim: true
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
purchaseOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
purchaseOrderSchema.index({ tenantId: 1, poDate: 1 });
purchaseOrderSchema.index({ tenantId: 1, vendorId: 1 });
purchaseOrderSchema.index({ tenantId: 1, status: 1 });
purchaseOrderSchema.index({ tenantId: 1, departmentId: 1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);