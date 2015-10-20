'use strict';

var _          = require('underscore');
var Promise    = require('bluebird');
var path       = require('path');
var createKeys = Promise.promisify(require('rsa-json'));
var fs         = Promise.promisifyAll(require('fs'));

function Config(basePath, ready) {
  var self = this;
  var config;
  var configFile = path.resolve(basePath, './config.json');

  var construct = function() {
    return setupConfig().then(function(data) { config = data; });
  };

  var setupConfig = function() {
    var defaultConfig = {
      "server.port": 1337,
      "pipes": {}
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
          config = _.extend(defaultConfig, { "server.keyPair": keyPair });
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
    return typeof config.pipes[name] !== 'undefined' && typeof config.pipes[name].outgoing !== 'undefined';
  };

  this.registerPipe = function(name, serverPublic, keyPair, hostname, port) {
    var pipe = {
      name: name,
      keyPair: keyPair,
      serverPublic: serverPublic,
      hostname: hostname,
      port: port || 1337
    };

    return self.reloadFromDisk()
      .then(function() {
        if(!config.pipes[name]) config.pipes[name] = { name: name };
        config.pipes[name].outgoing = pipe;
        fs.writeFileAsync(configFile, serialize());
      })
      .then(function() {
        return keyPair.public;
      });
  };

  this.authorize = function(name, publicKey) {
    return self.reloadFromDisk()
      .then(function() {
        if(!config.pipes[name]) config.pipes[name] = { name: name };
        config.pipes[name].incoming = publicKey.trim();
        return fs.writeFileAsync(configFile, serialize());
      })
      .then(function() {
        return self.get('server.keyPair')['public'];
      });
  };

  this.getAuthorized = function() {
    return _.values(config.pipes)
      .filter(function(pipe) {
        return pipe.incoming;
      })
      .reduce(function(authorizations, pipe) {
        authorizations[pipe.incoming] = pipe.name;
        return authorizations;
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

  this.reloadFromDisk = function() {
    return fs.readFileAsync(configFile, 'utf8')
      .then(JSON.parse)
      .then(function(newConfig) {
        config = newConfig;
      });
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
