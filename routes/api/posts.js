const express = require('express');
const passport = require('passport');

const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

const router = express.Router();

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { text, name, avatar } = req.body;
  const newPost = new Post({
    text, name, avatar, user: req.user.id
  });
  newPost.save()
    .then((post) => {
      res.json(post);
    })
    .catch(() => {
      errors.handle = 'Post doesnt exist';
      return res.status(404).json(errors);
    });
});

module.exports = router;
