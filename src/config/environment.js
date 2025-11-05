// Environment-specific configurations
const config = {
  development: {
    database: {
      url: process.env.MONGODB_URI || 'mongodb://localhost:27017/naac_financial_dev',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'dev_secret_key',
      expire: process.env.JWT_EXPIRE || '7d',
    },
    logging: {
      level: 'debug',
    },
  },
  production: {
    database: {
      url: process.env.MONGODB_URI,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expire: process.env.JWT_EXPIRE || '7d',
    },
    logging: {
      level: 'info',
    },
  },
  test: {
    database: {
      url: process.env.MONGODB_URI || 'mongodb://localhost:27017/naac_financial_test',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'test_secret_key',
      expire: process.env.JWT_EXPIRE || '1d',
    },
    logging: {
      level: 'error',
    },
  },
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];