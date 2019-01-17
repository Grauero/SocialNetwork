const express = require('express');

const posts = require('./api/posts');
const profile = require('./api/profile');
const users = require('./api/users');

const router = express.Router();
router.use('/posts', posts);
router.use('/profile', profile);
router.use('/users', users);

module.exports = router;
