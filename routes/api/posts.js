const express = require('express');
const passport = require('passport');

const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

const router = express.Router();

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(() => res.status(404).json({ noPostsFound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById({ user: req.params.id })
    .then(post => res.json(post))
    .catch(() => res.status(404).json({ noPostFound: 'No post found with that ID' }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
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
