const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const auditTrailSchema = new mongoose.Schema({
  auditTrailId: {
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
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  actionType: {
    type: String,
    required: true,
    enum: ['Create', 'Update', 'Delete', 'Read', 'Login', 'Logout', 'FailedLogin']
  },
  moduleName: {
    type: String,
    required: true,
    trim: true
  },
  entityName: {
    type: String,
    required: true,
    trim: true
  },
  entityId: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  requestData: {
    type: mongoose.Schema.Types.Mixed
  },
  responseData: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
});

// Index for efficient querying
auditTrailSchema.index({ tenantId: 1, userId: 1 });
auditTrailSchema.index({ tenantId: 1, actionType: 1 });
auditTrailSchema.index({ tenantId: 1, moduleName: 1 });
auditTrailSchema.index({ tenantId: 1, timestamp: 1 });
auditTrailSchema.index({ tenantId: 1, entityName: 1, entityId: 1 });

module.exports = mongoose.model('AuditTrail', auditTrailSchema);