'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customerSchema = new _mongoose.Schema({
    firstName: { type: 'String', required: true },
    lastName: { type: 'String', required: true },
    email: { type: 'String', required: true, unique: true },
    cuid: { type: 'String', required: true },
    dateAdded: { type: 'Date', default: Date.now, required: true }
});

var Customer = _mongoose2.default.model('Post', customerSchema);

exports.default = Customer;