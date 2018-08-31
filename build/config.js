'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var port = exports.port = 3005;
var mongodb = exports.mongodb = 'mongodb://localhost:27017/belocom';
var bodyLimit = exports.bodyLimit = '100kb';
var secret = exports.secret = 'secretfuckingword';
var jwtExpire = exports.jwtExpire = '7d';
var keyPath = exports.keyPath = 'key.pem';
var certPath = exports.certPath = 'server.crt';
var useHTTPS = exports.useHTTPS = false;
var mailerService = exports.mailerService = 'gmail';
var mailerEmail = exports.mailerEmail = 'belocomjs@gmail.com';
var mailerId = exports.mailerId = 'belocomjs@gmail.com';
var mailerPass = exports.mailerPass = 'train999';