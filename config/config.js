var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    assert = require('assert'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'albert'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/albert'
    // db: '../data/db/'
    // db: 'mongodb://mongo:27017/albert'
  },

  test: {
    root: rootPath,
    app: {
      name: 'albert'
    },
    port: process.env.PORT || 3000,
    // db: 'mongodb://localhost:27017/albert'
    db: 'mongodb://mongo:27017/albert'
  },

  production: {
    root: rootPath,
    app: {
      name: 'albert'
    },
    port: process.env.PORT || 3000,
    // db: 'mongodb://localhost:27017/albert'
    db: 'mongodb://mongo:27017/albert'
  }
};

module.exports = config[env];
