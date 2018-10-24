//controllers
var indexController = require('../controllers/index');


var path = require('path');
var fs = require('fs');

var app = require('express-promise-router')();

var routes = function(appSource) {

    // Home
    app.get('/', indexController.index);
 
    appSource.use('/',app);
};

module.exports = routes;
