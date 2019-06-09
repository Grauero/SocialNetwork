const Post = require('../../../models/Post');
const validatePostInput = require('../../../validation/post');

const addComentToPost = async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

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
};

const removeCommentFromPost = async (req, res) => {
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
};

module.exports = { addComentToPost, removeCommentFromPost };
