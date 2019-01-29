import React from 'react';
import propTypes from 'prop-types';

import PostItem from './PostItem';

const PostFeed = ({ posts }) => {
  return posts.map(post => <PostItem key={post._id} post={post} />);
};

PostFeed.propTypes = {
  posts: propTypes.instanceOf(Array).isRequired
};

export default PostFeed;
