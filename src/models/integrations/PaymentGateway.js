const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentGatewaySchema = new mongoose.Schema({
  paymentGatewayId: {
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
  gatewayName: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    required: true,
    enum: ['Razorpay', 'Stripe', 'PayPal', 'CCAvenue', 'PayU', 'Other']
  },
  merchantId: {
    type: String,
    trim: true
  },
  apiKey: {
    type: String,
    required: true
  },
  apiSecret: {
    type: String,
    required: true
  },
  webhookSecret: {
    type: String
  },
  webhookUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  supportedCurrencies: [{
    type: String
  }],
  transactionFee: {
    type: Number,
    default: 0
  },
  configuration: {
    type: mongoose.Schema.Types.Mixed
  },
  lastSyncDate: {
    type: Date
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
paymentGatewaySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
paymentGatewaySchema.index({ tenantId: 1, provider: 1 });
paymentGatewaySchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('PaymentGateway', paymentGatewaySchema);