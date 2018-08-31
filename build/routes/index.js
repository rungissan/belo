'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var router = new _express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

exports.default = router;