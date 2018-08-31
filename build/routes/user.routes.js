'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var router = new _express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET user profile. */
router.get('/profile', function (req, res, next) {
    res.send(req.user);
});

exports.default = router;