const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const vendorSchema = new mongoose.Schema({
  vendorId: {
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
  vendorCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  vendorType: {
    type: String,
    required: true,
    enum: ['Supplier', 'ServiceProvider', 'Contractor', 'Consultant']
  },
  category: [{
    type: String
  }],
  contactPerson: {
    name: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    mobile: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  taxDetails: {
    panNumber: {
      type: String,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true
    },
    tanNumber: {
      type: String,
      trim: true
    }
  },
  bankDetails: {
    accountNumber: {
      type: String,
      trim: true
    },
    bankName: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true
    },
    branch: {
      type: String,
      trim: true
    }
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  creditPeriod: {
    type: Number,
    default: 0 // in days
  },
  documents: [{
    documentType: {
      type: String,
      enum: ['GST', 'PAN', 'Cancelled Cheque', 'Contract', 'Other']
    },
    documentUrl: {
      type: String
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
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
vendorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
vendorSchema.index({ tenantId: 1, vendorType: 1 });
vendorSchema.index({ tenantId: 1, category: 1 });
vendorSchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);