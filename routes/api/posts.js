const express = require('express');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');

const router = express.Router();

// get posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    if (posts.length === 0) {
      throw new Error('No posts found');
    }

    return res.json(posts);
  } catch (err) {
    res.status(404).json({ noPostsFound: 'No posts found' });
  }
});

// get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(404).json({ noPostFound: 'No post found with that ID' });
  }
});

// create new post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { text, name, avatar } = req.body;
    const newPost = new Post({ text, name, avatar, user: req.user.id });

    try {
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      errors.handle = 'Post doesnt exist';
      return res.status(404).json(errors);
    }
  }
);

// delete post
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const post = await Post.findById(req.params.id);

      if (post.user.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ noAccess: 'User didnt create that post' });
      }

      await post.remove();
      return res.json({ success: true });
    } catch (err) {
      return res.status(404).json({ postNotFound: 'No post found' });
    }
  }
);

// add like to post
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const post = await Post.findById(req.params.id);
      const isLiked = post.likes.filter(
        like => like.user.toString() === req.user.id
      );

      if (isLiked.length > 0) {
        return res
          .status(400)
          .json({ alreadyLiked: 'User already liked this post' });
      }

      post.likes.unshift({ user: req.user.id });
      const updatedPost = await post.save();

      return res.json(updatedPost);
    } catch (err) {
      return res.status(404).json({ postNotFound: 'No post found' });
    }
  }
);

// remove like from post
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const post = await Post.findById(req.params.id);
      const isLiked = post.likes.filter(
        like => like.user.toString() === req.user.id
      );

      if (isLiked.length === 0) {
        return res
          .status(400)
          .json({ notLiked: 'User havent yet liked this post' });
      }

      const removeIndex = post.likes
        .map(item => item.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
      const updatedPost = await post.save();

      return res.json(updatedPost);
    } catch (err) {
      return res.status(404).json({ postNotFound: 'No post found' });
    }
  }
);

// add comment to post
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    try {
      const post = await Post.findById(req.params.id);
      const { text, name, avatar } = req.body;
      const newComment = { text, name, avatar, user: req.user.id };

      post.comments.unshift(newComment);
      const updatedPost = await post.save();

      return res.json(updatedPost);
    } catch (err) {
      return res.status(404).json({ postNotFound: 'No post found' });
    }
  }
);

// remove comment from post
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const isCommentExist = post.comments.filter(
        comment => comment._id.toString() === req.params.comment_id
      );

      if (isCommentExist.length === 0) {
        return res
          .status(404)
          .json({ commentNotExist: 'Comment doesnt exist' });
      }

      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);
      post.comments.splice(removeIndex, 1);
      const updatedPost = await post.save();

      return res.json(updatedPost);
    } catch (err) {
      return res.status(404).json({ postNotFound: 'No post found' });
    }
  }
);

module.exports = router;
