'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _customer = require('../controllers/customer.controller');

var _customer2 = _interopRequireDefault(_customer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();

// Get all Posts
router.get('/posts', function (req, res) {
    _customer2.default.getAll(req, res);
});

// Get one post by cuid
router.get('/posts/:cuid', function (req, res) {
    _customer2.default.getPost(req, res);
});

// Add a new Post
router.post('/posts', function (req, res) {
    _customer2.default.addPost(req, res);
});

router.put('/posts/:cuid', function (req, res) {
    _customer2.default.updatePost(req, res);
});

// Delete a post by cuid
router.delete('/posts/:cuid', function (req, res) {
    _customer2.default.deletePost(req, res);
});
exports.default = router;