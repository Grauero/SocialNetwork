const express = require('express');

const posts = require('./posts');
const comments = require('./comments');
const likes = require('./likes');

const router = express.Router();
router.use('/', posts);
router.use('/comment', comments);
router.use(likes);

module.exports = router;
