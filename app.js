var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    lessMiddleware = require('less-middleware'),
    nunjucks = require('nunjucks'),
    http = require('http'),
    routes = require('./routes'),
    mongoskin = require('mongoskin'),
    dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
    db = mongoskin.db(dbUrl, {
        safe: true
    }),
    collections = {
        articles: db.collection('articles'),
        users: db.collection('users')
    };

var app = express();


app.use(function (req, res, next) {
    if (!collections.articles || !collections.users) {
        return next(new Error('No collections'));
    }
    req.collections = collections;
    return next();
});


// view engine setup
nunjucks.configure('views', {
    autoescape: true,
    trimBlocks: true,
    express: app
});
app.set('view engine', 'nj');
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
    app.use(errorHandler());
}


// Pages and Routes
app.get('/', routes.index);
app.get('/login', routes.users.login);
app.post('/login', routes.users.authenticate);
app.get('/logout', routes.users.logout);
app.get('/admin', routes.article.admin);
app.get('/post', routes.article.post);
app.post('/post', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// REST api routes
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles:id', routes.article.edit);
app.del('/api/articles:id', routes.article.del);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// var server = http.createServer(app);
// var boot = function () {
//     server.listen(app.get('port'), function () {
//         console.info('Express server listening on port ' + app.get('port'));
//     });
// }
// var shutdown = function () {
//     server.close();
// }

if (require.main === module) {
    module.exports = app;
} else {
    // module.exports.port = app.get('port');
    // module.exports.boot = boot;
    // module.exports.shutdown = shutdown;
}
