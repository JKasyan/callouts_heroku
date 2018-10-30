var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('auth');
        if (username === 'admin' && password === 'admin') {
            return done(null, {username: 'admin'});
        } else {
            return done(null, false);
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    console.log('use ----->>>>>');
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/login', function(req, res, next) {
    res.render('login');
});
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        console.log('redirect login');
        res.redirect('/users');
    }
);

module.exports = app;
