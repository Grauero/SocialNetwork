const express = require('express');
const passport = require('passport');

const Post = require('../../../models/Post');
const validatePostInput = require('../../../validation/post');

const router = express.Router();

// add comment to post
router.post('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const post = await Post.findById(req.params.id);
    const { text, name, avatar } = req.body;
    const newComment = { text, name, avatar, user: req.user.id, handle: req.user.handle };

    post.comments.unshift(newComment);
    const updatedPost = await post.save();

    return res.json(updatedPost);
  } catch (err) {
    return res.status(404).json({ postNotFound: 'No post found' });
  }
});

// remove comment from post
router.delete(
  '/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const isCommentExist = post.comments.filter(
        comment => comment._id.toString() === req.params.comment_id
      );

      if (isCommentExist.length === 0) {
        return res.status(404).json({ commentNotExist: 'Comment doesnt exist' });
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
