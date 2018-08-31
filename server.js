import express from 'express';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import path from 'path';

import logger from 'morgan';
import passport from 'passport';

import https from 'https';
import http from 'http';
import cors from 'cors';
import fs from 'fs';

import connectToDb from './db/connect';

import index from './routes/index';
import posts from './routes/posts.routes';
import user from './routes/user.routes';
import auth from './routes/auth.routes';
import User from './models/user';

import { port, secret, keyPath, certPath, useHTTPS } from './config';
import { Strategy, ExtractJwt } from 'passport-jwt';
const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

import { Strategy as LocalStrategy } from 'passport-local';

const server = express();

connectToDb();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');

//server.use(logger('dev'));
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: false
  })
);
server.use(cors());
server.use(express.static(path.join(__dirname, 'public')));

server.use(passport.initialize());
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret
    },
    (jwtPayload, cb) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return User.findById(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

server.use('/', index);
server.use('/api', posts);
server.use('/auth', auth);
server.use('/user', passport.authenticate('jwt', { session: false }), user);

// catch 404 and forward to error handler
server.use((req, res, next) => {
  next(createError(404));
});

// error handler
server.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (useHTTPS) {
  const privateKey = fs.readFileSync(keyPath, 'utf8');
  const certificate = fs.readFileSync(certPath, 'utf8');
  const credentials = {
    key: privateKey,
    cert: certificate
  };
  const httpServer = http.createServer(function(req, res) {
    res.writeHead(301, {
      Location: `https://${req.headers['host']}${req.url}`
    });
    res.end();
  });
  const httpsServer = https.createServer(credentials, server);
  httpServer.listen(80);
  httpsServer.listen(port, () => {
    console.log(`Server listens on ${port} port`);
  });
} else {
  server.listen(port, () => {
    console.log(`Server listens on ${port} port`);
  });
}
