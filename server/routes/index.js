var express = require('express')

//controllers
var indexController = require('../controllers/index');
var commonController = require('../controllers/common');
var accountController = require('../controllers/account');
var pbstaskController = require('../controllers/pbstask');

var path = require('path');
var fs = require('fs');

var app = require('express-promise-router')();

var routes = function(appSource) {

    // Home
    app.get('/', indexController.index);

    app.get('/login', accountController.login);

    app.get('/submit', pbstaskController.taskSubmit);

    app.post('/upload', pbstaskController.uploadFile);

    app.post('/save', pbstaskController.savaScript);

    app.post('/launch', pbstaskController.launchTask);

    //下载 数据
    app.get('/test', indexController.test);
    app.get('/task/view/:id', commonController.viewFile);
    
    appSource.use('/',app);
};

module.exports = routes;
