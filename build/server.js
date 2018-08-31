'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _connect = require('./db/connect');

var _connect2 = _interopRequireDefault(_connect);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _posts = require('./routes/posts.routes');

var _posts2 = _interopRequireDefault(_posts);

var _user = require('./routes/user.routes');

var _user2 = _interopRequireDefault(_user);

var _auth = require('./routes/auth.routes');

var _auth2 = _interopRequireDefault(_auth);

var _user3 = require('./models/user');

var _user4 = _interopRequireDefault(_user3);

var _config = require('./config');

var _passportJwt = require('passport-jwt');

var _passportLocal = require('passport-local');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JWTStrategy = _passportJwt.Strategy;
var ExtractJWT = _passportJwt.ExtractJwt;

var server = (0, _express2.default)();

(0, _connect2.default)();

// view engine setup
server.set('views', _path2.default.join(__dirname, '../views'));
server.set('view engine', 'jade');

//server.use(logger('dev'));
server.use(_bodyParser2.default.json());
server.use(_bodyParser2.default.urlencoded({
  extended: false
}));
server.use((0, _cors2.default)());
server.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

server.use(_passport2.default.initialize());
_passport2.default.use(new _passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, _user4.default.authenticate()));
_passport2.default.serializeUser(_user4.default.serializeUser());
_passport2.default.deserializeUser(_user4.default.deserializeUser());
_passport2.default.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: _config.secret
}, function (jwtPayload, cb) {
  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
  return _user4.default.findById(jwtPayload.id).then(function (user) {
    return cb(null, user);
  }).catch(function (err) {
    return cb(err);
  });
}));

server.use('/', _routes2.default);
server.use('/api', _posts2.default);
server.use('/auth', _auth2.default);
server.use('/user', _passport2.default.authenticate('jwt', { session: false }), _user2.default);

// catch 404 and forward to error handler
server.use(function (req, res, next) {
  next((0, _httpErrors2.default)(404));
});

// error handler
server.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (_config.useHTTPS) {
  var privateKey = _fs2.default.readFileSync(_config.keyPath, 'utf8');
  var certificate = _fs2.default.readFileSync(_config.certPath, 'utf8');
  var credentials = {
    key: privateKey,
    cert: certificate
  };
  var httpServer = _http2.default.createServer(function (req, res) {
    res.writeHead(301, {
      Location: 'https://' + req.headers['host'] + req.url
    });
    res.end();
  });
  var httpsServer = _https2.default.createServer(credentials, server);
  httpServer.listen(80);
  httpsServer.listen(_config.port, function () {
    console.log('Server listens on ' + _config.port + ' port');
  });
} else {
  server.listen(_config.port, function () {
    console.log('Server listens on ' + _config.port + ' port');
  });
}