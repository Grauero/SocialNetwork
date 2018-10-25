const express = require('express');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');

const router = express.Router();

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => {
      if (posts.length === 0) { throw new Error('No posts found'); }

      return res.json(posts);
    })
    .catch(() => res.status(404).json({ noPostsFound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
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

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ noAccess: 'User didnt create that post' });
          }

          return post.remove().then(() => res.json({ success: true }));
        })
        .catch(() => res.status(404).json({ postNotFound: 'No post found' }));
    });
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.delete('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          const isLiked = post.like.filter(like => like.user.toString() === req.user.id);

          if (isLiked.length > 0) {
            return res.status(400).json({ alreadyLiked: 'User already liked this post' });
          }

          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(() => res.status(404).json({ postNotFound: 'No post found' }));
    });
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.delete('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          const isLiked = post.like.filter(like => like.user.toString() === req.user.id);

          if (isLiked.length === 0) {
            return res.status(400).json({ notLiked: 'You havent yet liked this post' });
          }

          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(() => res.status(404).json({ postNotFound: 'No post found' }));
    });
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then((post) => {
      const {
        text, name, avatar
      } = req.body;
      const newComment = {
        text, name, avatar, user: req.user.id
      };

      post.comments.unshift(newComment);
      post.save().then(post => res.json(post));
    })
    .catch(() => res.status(404).json({ postNotFound: 'No post found' }));
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      const isCommentExist = post.comments
        .filter(comment => comment._id.toString() === req.params.comment_id);

      if (isCommentExist.length === 0) {
        return res.status(404).json({ commentNotExist: 'Comment doesnt exist' });
      }

      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);
      post.save().then(post => res.json(post));
    })
    .catch(() => res.status(404).json({ postNotFound: 'No post found' }));
});

module.exports = router;
