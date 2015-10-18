'use strict';

var secure = require('secure-peer');
var net = require('net');

module.exports = function (inputStream, target) {
    var peer = secure(target.keyPair);
    var rawStream = net.connect(target.port, target.hostname);
    var sec = peer(function(stream) {
        inputStream.pipe(stream);
    });
    sec.pipe(rawStream).pipe(sec);
};
