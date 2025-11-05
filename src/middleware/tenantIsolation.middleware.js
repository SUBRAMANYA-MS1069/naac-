const tenantIsolation = (req, res, next) => {
  // Ensure tenantId is available
  if (!req.tenantId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'TENANT_REQUIRED',
        message: 'Tenant ID is required for this operation.',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Add tenantId to request object for use in controllers
  req.query.tenantId = req.tenantId;
  
  // For POST/PUT requests, ensure tenantId is included in the body
  if (req.body && typeof req.body === 'object') {
    req.body.tenantId = req.tenantId;
  }

  next();
};

module.exports = tenantIsolation;