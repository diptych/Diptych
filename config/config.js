var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'diptych-io'
    },
    port: 3000,
    db: 'mongodb://localhost/diptych-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'diptych-io'
    },
    port: 3000,
    db: 'mongodb://localhost/diptych-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'diptych-io'
    },
    port: 3000,
    db: 'mongodb://localhost/diptych-production'
  }
};

module.exports = config[env];
