'use strict';

var secure  = require('secure-peer');
var fs      = require('fs');
var net     = require('net');

module.exports = function(keyPair, authorized) {
  var peer = secure(keyPair);
  return net.createServer(function(rawStream) {

    var sec = peer(function(stream) {
      stream.pipe(fs.createWriteStream(process.env.HOME + '/.warp-pipe/' + stream.id.name, 'w'));
    });

    sec.on('identify', function (id) {
      var key = id.key['public'];
      if (typeof authorized[key] === 'undefined') {
        console.error('Rejecting unknown key');
        return id.reject();
      }

      id.name = authorized[key];
      id.accept();
    });

    sec.pipe(rawStream).pipe(sec);
  });
};
