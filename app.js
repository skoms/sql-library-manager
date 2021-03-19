var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } =  require('./models');

// Authenticates and syncs the database and logs whether is was a success or failure
sequelize.authenticate()
  .then(() => {
   console.log("'Sequelize' has established connection with 'SQLite' successfully.");
   sequelize.sync();
   console.log(path.join(__dirname, 'public'));
  })
  .catch(err => {
   console.log("'Sequelize' was unable to connect to the database: ", err);
  });


var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public'))); // '/static/dir-name/file-name' to access static files

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const pageNotFound = new Error();
  pageNotFound.status = 404;
  pageNotFound.message = 'Sorry, the page you were looking for does not exist! Please try again.';
  res.render('page-not-found', { title: "Page Not Found", error: pageNotFound });
});

// error handler
app.use(function(err, req, res, next) {
  err.status = err.status || 500;
  err.message = err.message || "A server issue has occured, please try refresh the page.";
  
  console.log(`Status: ${err.status} | Message: ${err.message}`);

  // render the error page
  res.render('error', { title: "Server Error", err: err });
});

module.exports = app;
