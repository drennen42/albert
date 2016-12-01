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
    // db: 'mongodb://localhost:32768/albert'
    // db: 'mongodb://mongo:32768/albert'
    db: 'mongodb://mongo:27017/albert'
    // db: 'mongodb://127.0.0.1:27017/albert'
    // db: mongo.db('mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/albert')
  },

  test: {
    root: rootPath,
    app: {
      name: 'albert'
    },
    port: process.env.PORT || 3000,
    // db: 'mongodb://localhost:32768/albert'
    // db: 'mongodb://mongo:32768/albert'
    db: 'mongodb://mongo:27017/albert'
    // db: 'mongodb://127.0.0.1:27017/albert'
    // db: mongo.db('mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/albert')
  },

  production: {
    root: rootPath,
    app: {
      name: 'albert'
    },
    port: process.env.PORT || 3000,
    // db: 'mongodb://localhost:32768/albert'
    // db: 'mongodb://mongo:32768/albert'
    db: 'mongodb://mongo:27017/albert'
    // db: 'mongodb://127.0.0.1:27017/albert'
    // db: mongo.db('mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/albert')
  }
};

module.exports = config[env];
