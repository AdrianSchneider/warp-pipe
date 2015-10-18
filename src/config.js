'use strict';

var _          = require('underscore');
var Promise    = require('bluebird');
var path       = require('path');
var createKeys = Promise.promisify(require('rsa-json'));
var fs         = Promise.promisifyAll(require('fs'));

function Config(basePath, ready) {
  var config;
  var configFile = path.resolve(basePath, './config.json');

  var construct = function() {
    return setupConfig().then(function(data) { config = data; });
  };

  var setupConfig = function() {
    var defaultConfig = {
      "server.port": 1337,
      "pipes": {},
      "authorized": {}
    };

    return fs.statAsync(basePath)
      .then(function(exists) {  return require(configFile); })
      .catch(
        function(error) { return error.message.indexOf('ENOENT') !== -1; },
        function(error) { return fs.mkdirAsync(basePath); }
      )
      .then(function() {
        config = require(configFile);
        return config;
      })
      .catch(function(error) {
        return createKeys().then(function(keyPair) {
          var config = _.extend(defaultConfig, { "server.keyPair": keyPair });
          return fs.writeFileAsync(configFile, serialize())
          .then(function() {
            return config;
          });
        });
      });
  };

  this.get = function(key) {
    if(!config) throw new Error('Config is not loaded yet (fetching ' + key + ')');
    return config[key];
  };

  this.hasPipe = function(name) {
    return typeof config.pipes[name] !== 'undefined';
  };

  this.registerPipe = function(name, keyPair, hostname, port) {
    config.pipes[name] = {
      keyPair: keyPair,
      hostname: hostname,
      port: port || 1337
    };

    return fs.writeFileAsync(configFile, serialize())
      .then(function() {
        return keyPair.public;
      });
  };

  this.hasAuthorized = function(name) {
    return typeof config.authorized[name] !== 'undefined';
  };

  this.authorize = function(name, publicKey) {
    config.authorized[name] = publicKey;
    return fs.writeFileAsync(configFile, serialize());
  };

  this.getAuthorized = function() {
    return Object.keys(config.authorized).reduce(function(out, name) {
      out[config.authorized[name]] = name;
      return out;
    }, {});
  };

  this.getNameByKey = function(key) {
    return _.findKey(config.pipes, function(pipe) {
      return key.trim() === pipe.keyPair['public'].trim();
    });
  };

  var serialize = function() {
    return JSON.stringify(config, null, 4);
  };

  this.getPipeFilename = function(name) {
    return path.resolve(
      basePath,
      './' + name
    );
  };


  construct().then(function() { ready(); });
}

Config.load = function(basePath) {
  return new Promise(function(resolve, reject) {
    var config = new Config(basePath, function(err, data) {
      if(err) return reject(err);
      resolve(config);
    });
  });
};

module.exports = Config;
