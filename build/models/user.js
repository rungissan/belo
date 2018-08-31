'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passportLocalMongoose = require('passport-local-mongoose');

var _passportLocalMongoose2 = _interopRequireDefault(_passportLocalMongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var userSchema = new Schema({
    email: {
        type: 'String',
        required: true,
        unique: true
    },
    hash: String,
    name: {
        type: 'String',
        required: true
    },
    profile: String,
    role: {
        type: String,
        default: 'USER'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verif_token: String,
    verif_token_expired: Date,
    reset_password_token: String,
    reset_password_expires: Date,
    lastVisit: {
        type: Date,
        default: Date.now()
    },
    dateAdded: {
        type: 'Date',
        default: Date.now,
        required: true
    }
});

userSchema.plugin(_passportLocalMongoose2.default);

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;