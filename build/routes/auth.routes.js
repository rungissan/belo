'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _auth = require('../controllers/auth.controller');

var _auth2 = _interopRequireDefault(_auth);

var _authMiddleware = require('../middleware/authMiddleware');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();

router.post('/register', function (req, res) {
    _auth2.default.register(req, res);
});

router.post('/login', function (req, res, next) {
    _auth2.default.login(req, res, next);
});
router.get('/confirmation', function (req, res, next) {
    _auth2.default.confirmation(req, res, next);
});
router.get('/renew', function (req, res, next) {
    _auth2.default.renew(req, res, next);
});
router.post('/forgot_password', function (req, res, next) {
    _auth2.default.forgotPassword(req, res, next);
});
router.post('/reset_password', function (req, res, next) {
    _auth2.default.resetPassword(req, res, next);
});
router.get('/reset_password', function (req, res, next) {
    _auth2.default.resetPassGetTemplate(req, res, next);
});

/*router.post('/login', passport.authenticate(
    'local', {
        session: false,
        scope: []
    }), generateToken, respond); */

router.post('/profile', function (req, res) {
    _auth2.default.profile(req, res);
});

exports.default = router;