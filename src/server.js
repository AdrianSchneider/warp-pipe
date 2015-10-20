'use strict';

var secure  = require('secure-peer');
var fs      = require('fs');
var net     = require('net');

module.exports = function(config) {
  var peer = secure(config.get('server.keyPair'));
  return net.createServer(function(upload) {
    config.reloadFromDisk().then(function() {
      var sec = peer(function(stream) {
        stream.pipe(fs.createWriteStream(process.env.HOME + '/.warp-pipe/' + stream.id.name, 'w'));
      });

      sec.on('identify', function(id) {
        var authorized = config.getAuthorized();
        var key = id.key['public'].trim();
        if (typeof authorized[key] === 'undefined') {
          console.error('Rejecting unknown key');
          return id.reject();
        }

        id.name = authorized[key];
        id.accept();
      });
    
      sec.pipe(upload).pipe(sec);
    });
  });
};
