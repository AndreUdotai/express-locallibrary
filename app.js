var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog'); //Import routes for "catalog" area of site
const compression = require("compression"); //Import compression to compress the HTTP response sent back to a client
const helmet = require("helmet");

var app = express();

//set appropriate HTTP headers that help protect your app from well-known web vulnerabilities
app.use(helmet());
// Set up mongoose connection
// This code creates the default connection to the database and binds to the error
// event (so that errors will be printed to the console).
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || 'mongodb+srv://andreudotai:mineshadow@cluster0.r368mde.mongodb.net/local_library?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
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

module.exports = app;
