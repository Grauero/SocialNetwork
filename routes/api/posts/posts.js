const express = require('express');
const passport = require('passport');

const postsController = require('../../../controllers/api/posts/posts');

const router = express.Router();

router
  .route('/')
  .get(postsController.getAllPosts)
  .post(passport.authenticate('jwt', { session: false }), postsController.createPost);

router
  .route('/:id')
  .get(postsController.getPost)
  .delete(passport.authenticate('jwt', { session: false }), postsController.deletePost);

module.exports = router;
