'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var connectToDb = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _mongoose2.default.connect(_config.mongodb, {
                            useMongoClient: true
                        });

                    case 3:
                        console.info('Connected to mongo!!!');
                        // logger.info('Connected to mongo!!!');
                        _context.next = 9;
                        break;

                    case 6:
                        _context.prev = 6;
                        _context.t0 = _context['catch'](0);

                        console.error(_context.t0);
                        //logger.error('Could not connect to MongoDB');

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 6]]);
    }));

    return function connectToDb() {
        return _ref.apply(this, arguments);
    };
}();

exports.default = connectToDb;