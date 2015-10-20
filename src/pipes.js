'use strict';

function Pipes(config) {
  var pipes = {};

  this.has = function(name) {

  };

  this.registerOutgoing = function(name, keyPair, hostname, port) {
    config.reloadFromDisk()
      .then(function() {
        if (typeof pipes[name] === 'undefined') {
          pipes[name] = {};
        }

        pipes[name].outgoing = {
          name: name,
          hostname: hostname,
          port: port,
          keyPair: keyPair
        };
      });
  };

  this.registerIncoming = function(pipe) {
    config.reloadFromDisk().then(function() {

    });
  };

}
