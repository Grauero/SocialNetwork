const Post = require('../../../models/Post');
const Profile = require('../../../models/Profile');
const validatePostInput = require('../../../validation/post');

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    if (posts.length === 0) {
      throw new Error('No posts found');
    }

    return res.json(posts);
  } catch (err) {
    res.status(404).json({ noPostsFound: 'No posts found' });
  }
};

const createPost = async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { text, name, avatar } = req.body;
  const newPost = new Post({
    text,
    name,
    avatar,
    user: req.user.id,
    handle: req.user.handle
  });

  try {
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    errors.handle = 'Post doesnt exist';
    return res.status(404).json(errors);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(404).json({ noPostFound: 'No post found with that ID' });
  }
};

const deletePost = async (req, res) => {
  try {
    await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ noAccess: 'User didnt create that post' });
    }

    await post.remove();
    return res.json({ success: true });
  } catch (err) {
    return res.status(404).json({ postNotFound: 'No post found' });
  }
};

module.exports = { getAllPosts, createPost, getPost, deletePost };
