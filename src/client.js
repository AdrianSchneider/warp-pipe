'use strict';

var secure = require('secure-peer');
var net = require('net');

module.exports = function(inputStream, target) {
  var peer = secure(target.keyPair);
  var upload = net.connect(target.port, target.hostname);
  var sec = peer(function(stream) { inputStream.pipe(stream); });
  sec.pipe(upload).pipe(sec);

  sec.on('identify', function(id) {
    if (target.serverPublic.trim() !== id.key['public'].trim()) {
      id.reject();
      throw new Error('Rejecting unknown serer key');
    }

    id.accept();
  });

};
