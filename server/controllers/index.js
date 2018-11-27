var fs=require('fs');
var path=require('path');
var config = require('../config/secrets');
var Client = require('ssh2').Client;


var indexController = function(req, res) {
    res.render('index');
};

var testController = function(req, res) {
    res.render('test');
};

var sshController = function(req, res) {
    var conn = new Client();

    conn.on('ready', function() {
    console.log('Client :: ready');
    conn.exec('uptime', function(err, stream) {
        if (err) throw err;
            stream.on('close', function(code, signal) {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
            }).on('data', function(data) {
            console.log('STDOUT: ' + data);
            }).stderr.on('data', function(data) {
            console.log('STDERR: ' + data);
            });
    });
    }).connect({
        host: config.pbs.host,
        port: config.pbs.port,
        username:  config.pbs.user,
        password: config.pbs.pass
    });
};


module.exports = {
    index: indexController,
    ssh: sshController,
    test: testController,
};
