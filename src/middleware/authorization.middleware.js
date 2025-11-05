const { USER_ROLES } = require('../config/constants');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Access denied. No user authenticated.',
          timestamp: new Date().toISOString()
        }
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied. Insufficient permissions.',
          timestamp: new Date().toISOString()
        }
      });
    }

    next();
  };
};

// Specific role-based middleware
const adminOnly = authorize(USER_ROLES.ADMIN);
const financeManagerOnly = authorize(USER_ROLES.ADMIN, USER_ROLES.FINANCE_MANAGER);
const accountantOnly = authorize(USER_ROLES.ADMIN, USER_ROLES.FINANCE_MANAGER, USER_ROLES.ACCOUNTANT);
const auditorOnly = authorize(USER_ROLES.ADMIN, USER_ROLES.AUDITOR);

module.exports = {
  authorize,
  adminOnly,
  financeManagerOnly,
  accountantOnly,
  auditorOnly
};