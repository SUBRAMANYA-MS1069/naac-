const jwt = require('jsonwebtoken');
const { verifyToken } = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Access denied. No token provided.',
          timestamp: new Date().toISOString()
        }
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token.',
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = authMiddleware;