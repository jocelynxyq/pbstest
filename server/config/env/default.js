/**
 * Default Configuration for all environments
 */
'use strict';

var path = require('path');

// All configurations will extend these options
var defaults = {
  root: path.normalize(__dirname + '/../../..'),
  staticAssets: 'client',

};

// Export the config object based on the NODE_ENV
module.exports = defaults;
