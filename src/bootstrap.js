'use strict';

var path = require('path');
var Config = require('./config');

module.exports = Config.load(path.resolve(process.env.HOME, './.warp-pipe'));
