var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'expressalbert'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:32768/albert'
  },

  test: {
    root: rootPath,
    app: {
      name: 'expressalbert'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:32768/albert'
  },

  production: {
    root: rootPath,
    app: {
      name: 'expressalbert'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:32768/albert'
  }
};

module.exports = config[env];
