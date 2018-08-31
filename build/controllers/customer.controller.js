'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _customer = require('../models/customer');

var _customer2 = _interopRequireDefault(_customer);

var _cuid = require('cuid');

var _cuid2 = _interopRequireDefault(_cuid);

var _limax = require('limax');

var _limax2 = _interopRequireDefault(_limax);

var _sanitizeHtml = require('sanitize-html');

var _sanitizeHtml2 = _interopRequireDefault(_sanitizeHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomerController = {};

CustomerController.getAll = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _customer2.default.find().sort('-dateAdded').exec(function (err, customers) {
                            if (err) {
                                res.status(500).send(err);
                            }
                            res.json({
                                customers: customers
                            });
                        });

                    case 3:
                        _context.next = 8;
                        break;

                    case 5:
                        _context.prev = 5;
                        _context.t0 = _context['catch'](0);

                        res.send(_context.t0);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 5]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

CustomerController.getPost = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        try {
                            _customer2.default.findOne({
                                cuid: req.params.cuid
                            }).exec(function (err, customer) {
                                if (err) {
                                    res.status(500).send(err);
                                }
                                res.json({
                                    customer: customer
                                });
                            });
                        } catch (err) {
                            res.send(err);
                        }

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

CustomerController.addPost = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var newCustomer;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        try {
                            if (!req.body.customer.fistName || !req.body.customer.lastName || !req.body.customer.userName) {
                                res.status(403).end();
                            }

                            newCustomer = new _customer2.default(req.body.customer);

                            // Let's sanitize inputs

                            newCustomer.firstName = (0, _sanitizeHtml2.default)(newCustomer.firstName);
                            newCustomer.lastName = (0, _sanitizeHtml2.default)(newCustomer.lastName);
                            newCustomer.userName = (0, _sanitizeHtml2.default)(newCustomer.userName);

                            newCustomer.cuid = (0, _cuid2.default)();

                            newCustomer.save(function (err, saved) {
                                if (err) {
                                    res.status(500).send(err);
                                }
                                res.json({
                                    customer: saved
                                });
                            });
                        } catch (err) {
                            console.log(err);
                        }

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

CustomerController.updatePost = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        try {
                            if (!req.body.customer.fistName || !req.body.customer.lastName) {
                                res.status(403).end();
                            }
                            _customer2.default.findOne({
                                cuid: req.params.cuid
                            }).exec(function (err, customer) {
                                // Handle any possible database errors
                                if (err) {
                                    res.status(500).send(err);
                                } else {
                                    // Update each attribute with any possible attribute that may have been submitted in the body of the request
                                    // If that attribute isn't in the request body, default back to whatever it was before.
                                    customer.fistName = req.body.customer.firstName || customer.firstName;
                                    customer.lastName = req.body.customer.lastName || customer.content;
                                    console.log('Customer about to be saved');
                                    // Save the updated document back to the database
                                    customer.save(function (err, saved) {
                                        if (err) {
                                            res.status(500).send(err);
                                        }
                                        res.json({
                                            customer: saved
                                        });
                                    });
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }

                    case 1:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

CustomerController.deletePost = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        try {
                            _customer2.default.findOne({
                                cuid: req.params.cuid
                            }).exec(function (err, customer) {
                                if (err) {
                                    res.status(500).send(err);
                                }

                                customer.remove(function () {
                                    res.status(200).end();
                                });
                            });
                        } catch (err) {
                            console.log(err);
                        }

                    case 1:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

exports.default = CustomerController;