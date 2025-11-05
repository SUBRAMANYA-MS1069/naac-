const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const webhookSchema = new mongoose.Schema({
  webhookId: {
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
  url: {
    type: String,
    required: true,
    trim: true
  },
  events: [{
    type: String,
    enum: [
      'payment.received',
      'payment.failed',
      'invoice.generated',
      'budget.exceeded',
      'bill.approved',
      'salary.processed',
      'po.approved',
      'reconciliation.completed'
    ]
  }],
  secret: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  retryAttempts: {
    type: Number,
    default: 3
  },
  timeout: {
    type: Number,
    default: 5000 // in milliseconds
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
webhookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
webhookSchema.index({ tenantId: 1, isActive: 1 });
webhookSchema.index({ tenantId: 1, events: 1 });

module.exports = mongoose.model('Webhook', webhookSchema);