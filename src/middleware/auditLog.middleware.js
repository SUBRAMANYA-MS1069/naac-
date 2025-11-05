const AuditTrail = require('../models/reports/AuditTrail');

const auditLog = (actionType, moduleName, entityName) => {
  return async (req, res, next) => {
    try {
      // Wait for the response to be sent
      res.on('finish', async () => {
        // Only log successful requests
        if (res.statusCode < 400) {
          const auditEntry = new AuditTrail({
            tenantId: req.tenantId,
            userId: req.user?.userId,
            userName: req.user?.name || 'Unknown',
            actionType,
            moduleName,
            entityName,
            entityId: req.params.id || req.body.id || 'N/A',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            requestData: {
              method: req.method,
              url: req.originalUrl,
              body: req.body,
              query: req.query,
              params: req.params
              // Remove sensitive data
            },
            responseData: {
              statusCode: res.statusCode
            }
          });

          // Remove sensitive data from request body
          if (auditEntry.requestData.body) {
            const sensitiveFields = ['password', 'token', 'secret', 'key'];
            sensitiveFields.forEach(field => {
              if (auditEntry.requestData.body[field]) {
                delete auditEntry.requestData.body[field];
              }
            });
          }

          await auditEntry.save();
        }
      });
    } catch (error) {
      console.error('Audit log error:', error);
    }

    next();
  };
};

module.exports = auditLog;