var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
// We comment this due to requirement on the training
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015')); // esta cadena es para encriptar la cookie de sesión
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session());

// Helpers dinamicos:
app.use(function(req, res, next){
	
	// guardar path en session.redir para despues de login
	if(!req.path.match(/\/login|\/logout/)){
		req.session.redir = req.path;
	}
	
	// guarda la fecha para el autologout
	if(req.session.user){
		if(typeof(req.session.lastCon) !== 'undefined' && (Date.now() - req.session.lastCon) > 120000){ // dos minutos
			delete req.session.user;
			delete req.session.lastCon;
			req.session.errors = [
				{   'message': 'Su sesión ha expirado' }
			];
			res.redirect('/login');
		}
		req.session.lastCon = Date.now();
	}
	
	// hace visible req.session en las vistas
	res.locals.session = req.session;
	
	next();
});

app.use('/', routes);

// We comment this due to requirement on the training
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;