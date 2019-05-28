const Post = require('../../../models/Post');
const Profile = require('../../../models/Profile');

const addLikeToPost = async (req, res) => {
  try {
    await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.filter(like => like.user.toString() === req.user.id);

    if (isLiked.length > 0) {
      return res.status(400).json({ alreadyLiked: 'User already liked this post' });
    }

    post.likes.unshift({ user: req.user.id });
    const updatedPost = await post.save();

    return res.json(updatedPost);
  } catch (err) {
    return res.status(404).json({ postNotFound: 'No post found' });
  }
};

const removeLikeFromPost = async (req, res) => {
  try {
    await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.filter(like => like.user.toString() === req.user.id);

    if (isLiked.length === 0) {
      return res.status(400).json({ notLiked: 'User havent yet liked this post' });
    }

    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    const updatedPost = await post.save();

    return res.json(updatedPost);
  } catch (err) {
    return res.status(404).json({ postNotFound: 'No post found' });
  }
};

module.exports = { addLikeToPost, removeLikeFromPost };
