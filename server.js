var express = require('express')

// Add coloring for console output
require('colors');

var app = express()

// Express configuration
require('./server/config/express')(app, express);

app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app;