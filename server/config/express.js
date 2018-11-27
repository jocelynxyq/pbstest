var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
var errorHandler = require('errorhandler');

//处理文件上传中间件
var multer  = require('multer');

// Configuration files
var settings = require('./env/default');

var expressConfig = async function(app, express) {
    // view engine setup
    app.engine('pug', require('pug').renderFile);
    app.set('view engine', 'pug');

    // Setup path where all server templates will reside
    app.set('views', path.join(settings.root, 'server/templates'));

    // Enable GZip compression for all static assets
    app.use(compress());

    app.use(express.static(path.join(settings.root, '.tmp'), {maxAge: 0}));
    app.use('/bower_components', express.static(path.join(settings.root, 'client/bower_components'), {maxAge: 0}));

    // Load static assets
    app.use(express.static(path.join(settings.root, settings.staticAssets))); 

    app.use('/public',express.static('client/public'));

    // Load virtual screen
    app.use(bodyParser({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb'}));
    app.use(bodyParser());  

    // Returns middleware that parses both json and urlencoded.
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Returns middleware that parses cookies
    app.use(cookieParser());

    //要定期清理缓存文件夹
    app.use(multer({ 
      dest: './client/uploads', 
      rename: function (fieldname, filename) {
        return filename;
      },
      inMemory: true
      }
    ));

    app.use(logger('dev'));

    // Disable caching for easier testing
    app.use(function noCache(req, res, next) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
        next();
      });
      
    // Load routes
    require(path.join(settings.root,'./server/routes'))(app);

    // 404 Error Handler
    app.use(function(req, res) {
        res.status(404);
        res.format({
            html: function() {
            res.render('error', {
                status: 404,
                message: 'Page not found',
                error: {}
            });
            },
            json: function() {
            res.json({
                status: 404,
                message: 'Page not found',
                error: {}
            });
            },
            text: function() {
            res.send(404 + ': ' + 'Page not found');
            }
        });
    });


    app.use(function(err, req, res, next) {

        //var error = err.error || err;
        var message = err.message;
        var status = err.status || 500;
    
        res.status(status);
        res.format({
          html: function() {
            res.render('error', {
              status: status,
              message: message,
              error: {}
            });
          },
          json: function() {
            res.json({
              status: status,
              message: message,
              error: {}
            });
          },
          text: function() {
            res.send(status + ': ' + message);
          }
        });
      });
    
    
};

module.exports = expressConfig;










