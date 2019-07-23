const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
const auth = require('./lib/auth');
const createError = require('http-errors');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    genid: req => {
      console.log('Inside the session middleware');
      console.log(req.sessionID);
      return uuid();
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
  })
);

app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

// Define routes
// app.get('/', (req, res) => {
//   console.log('Inside the homepage callback function');
//   console.log(req.sessionID);
// });

app.get('/login', (req, res, next) => {
  console.log('Inside the login get callback function');
  console.log(req.sessionID);
  res.render('login', { title: 'Login Page' });
});

app.post('/login', (req, res, next) => {
  console.log('Inside the login post callback function');
  console.log(req.sessionID);
  auth.authenticate('local', (err, user, info) => {
    if (info) {
      return res.send(info.message);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      console.log(`res.locals.user: ${JSON.stringify(res.locals.user)}`);
      return res.send('You were authenticated!\n');
      // return res.redirect('/admin');
    });
  })(req, res, next);
});

app.get('/logout', (req, res, next) => {
  req.logOut();
  return res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
