var config = require('./server/config/secrets');
var Client = require('ssh2').Client;
 
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