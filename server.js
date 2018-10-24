var express = require('express')

var app = express()

// Add coloring for console output
require('colors');

// Express configuration
require('./server/config/express')(app, express);

app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app;