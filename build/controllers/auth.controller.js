'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _nodemailer = require('nodemailer');

var _nodemailerExpressHandlebars = require('nodemailer-express-handlebars');

var _nodemailerExpressHandlebars2 = _interopRequireDefault(_nodemailerExpressHandlebars);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _bcrypt = require('bcrypt');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _authMiddleware = require('../middleware/authMiddleware');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AuthController = {};


var smtpTransport = (0, _nodemailer.createTransport)({
    service: _config.mailerService,
    auth: {
        user: _config.mailerId,
        pass: _config.mailerPass
    }
});

var handlebarsOptions = {
    viewEngine: 'handlebars',
    viewPath: _path2.default.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', (0, _nodemailerExpressHandlebars2.default)(handlebarsOptions));

var checkAuthData = function checkAuthData(email, password) {
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var profile = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    var MIN_PASSWORD_LENGTH = 6;
    var MAX_PASSWORD_LENGTH = 255;
    var MAX_PROFILE_LENGTH = 300;
    var passwordLength = password.length;
    var profileLength = profile.length;
    var regExpEmail = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
    var regExpName = /\s/;
    var isValidEmail = email.match(regExpEmail);
    var isNotValidName = name.match(regExpName);
    var isValidPassword = passwordLength >= MIN_PASSWORD_LENGTH && passwordLength <= MAX_PASSWORD_LENGTH;
    var isValidProfile = profileLength <= MAX_PROFILE_LENGTH;
    return {
        isValidEmail: isValidEmail,
        isValidPassword: isValidPassword,
        isNotValidName: isNotValidName,
        isValidProfile: isValidProfile
    };
};

AuthController.register = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;

                        _user2.default.register(new _user2.default({ username: req.body.email,
                            email: req.body.email,
                            name: req.body.name
                        }), req.body.password, function (err, account) {
                            if (err) {
                                return res.status(500).send('An error occurred: ' + err);
                            }

                            _passport2.default.authenticate('local', {
                                session: false
                            })(req, res, function () {
                                res.status(200).send('Successfully created new account');
                            });
                        });
                        _context.next = 7;
                        break;

                    case 4:
                        _context.prev = 4;
                        _context.t0 = _context['catch'](0);
                        return _context.abrupt('return', res.status(500).send('An error occurred: ' + _context.t0));

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 4]]);
    }));

    return function (_x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

AuthController.login = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;

                        if (!(!req.body.email || !req.body.password)) {
                            _context2.next = 3;
                            break;
                        }

                        return _context2.abrupt('return', res.status(400).json({
                            message: 'Something is not right with your input'
                        }));

                    case 3:
                        _passport2.default.authenticate('local', { session: false }, function (err, user, info) {
                            if (err || !user) {
                                return res.status(400).json({
                                    message: 'Something is not right',
                                    user: user
                                });
                            }
                            req.login(user, { session: false }, function (err) {
                                if (err) {
                                    res.send(err);
                                }
                                // generate a signed son web token with the contents of user object and return it in the response
                                var token = _jsonwebtoken2.default.sign({
                                    id: user.id,
                                    email: user.email,
                                    role: user.role
                                }, _config.secret);
                                return res.json({ email: user.email, token: token });
                            });
                        })(req, res);
                        _context2.next = 9;
                        break;

                    case 6:
                        _context2.prev = 6;
                        _context2.t0 = _context2['catch'](0);

                        console.log(_context2.t0);

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[0, 6]]);
    }));

    return function (_x5, _x6, _x7) {
        return _ref2.apply(this, arguments);
    };
}();

AuthController.logout = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        req.logout();
                        res.status(200).send('Successfully logged out');

                    case 2:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x8, _x9) {
        return _ref3.apply(this, arguments);
    };
}();

AuthController.profile = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        try {
                            res.send(req.user);
                        } catch (err) {
                            res.send("No user Returned");
                        }

                    case 1:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x10, _x11) {
        return _ref4.apply(this, arguments);
    };
}();

var roleCheck = function roleCheck(req, res, next) {
    _promise2.default.resolve().then(function () {
        var authHeader = req.headers['authorization'];
        if (!authHeader) throw new Error();
        var token = authHeader.split(' ')[1];
        req.user = _jsonwebtoken2.default.verify(token, _config.secret);
        if (undefined.indexOf(req.user.role) === -1) throw new Error();
        next();
    }).catch(function (err) {
        return res.send(" Role check error");
    });
};

var handlers = {};

AuthController.requireRole = function (roles) {
    var key = roles.sort().join('|');
    if (!handlers[key]) {
        handlers[key] = roleCheck.bind(roles);
    }
    console.log(handlers[key]);
    return handlers[key];
};
AuthController.forgotPassword = function (req, res, next) {
    _promise2.default.resolve().then(function () {
        return _user2.default.findOne({
            email: req.body.email
        });
    }).then(function (user) {
        if (!user) throw new Error();
        var buffer = _crypto2.default.randomBytes(20);
        var token = buffer.toString('hex');
        return {
            user: user,
            token: token
        };
    }).then(function (_ref5) {
        var user = _ref5.user,
            token = _ref5.token;

        return _user2.default.findByIdAndUpdate({
            _id: user._id
        }, {
            reset_password_token: token,
            reset_password_expires: Date.now() + 86400000
        }, {
            upsert: true,
            new: true
        }).exec(function (newUser) {}).then(function (newUser) {
            var data = {
                to: newUser.email,
                from: _config.mailerEmail,
                template: 'forgot-password-email',
                subject: 'Password help from Belocom!',
                context: {
                    url: 'http://localhost:3005/auth/reset_password?token=' + token,
                    name: newUser.name
                }
            };
            return smtpTransport.sendMail(data, function (err) {
                if (!err) {
                    return res.status(200);
                } else {
                    return res.status(403);
                }
            });
        }).catch(function (err) {
            return console.error(err);
        });
    });
};

AuthController.resetPassGetTemplate = function (req, res, next) {
    console.log('пртвет');
    console.log(req.query.token);
    _promise2.default.resolve().then(function () {
        return _user2.default.findOne({
            reset_password_token: req.query.token,
            reset_password_expires: {
                $gt: Date.now()
            }
        }).exec(function (err, user) {
            console.log(user);
            if (!user) return res.status(404).redirect('http://localhost:3005/password-reset-error');
            return res.render('reset_password', {
                title: 'Reset Password'
            });
            //    res.render(path.resolve('./public/views/change-password.html'));
        }).catch(function (err) {
            return console.error(err);
        });
    });
};

AuthController.resetPassword = function (req, res, next) {
    _promise2.default.resolve().then(function () {
        return _user2.default.findOne({
            reset_password_token: req.body.token,
            reset_password_expires: {
                $gt: Date.now()
            }
        }).exec(function (err, user) {
            if (err) return res.status(404).send({
                message: 'Sorry, this password reset link is invalid'
            });
            if (!user) return res.status(404).send({
                message: 'Sorry, this password reset link is invalid'
            });
            if (req.body.newPassword !== req.body.verifyPassword) {
                return res.status(422).send({
                    message: 'Passwords do not match'
                });
            } else {
                user.hash = (0, _bcrypt.hashSync)(req.body.newPassword, 10);
                user.reset_password_token = null;
                user.reset_password_expires = null;
                user.save();
                return user;
            }
        }).then(function (user) {
            if (user.reset_password_token) return;
            var data = {
                to: user.email,
                from: _config.mailerEmail,
                template: 'reset-password-email',
                subject: 'Password Reset Confirmation',
                context: {
                    name: user.name
                }
            };
            return smtpTransport.sendMail(data, function (err) {
                if (!err) return res.json({
                    message: 'Your password was changed successfully'
                });
            });
        }).catch(function (err) {
            return console.log(err);
        });
    });
};

exports.default = AuthController;