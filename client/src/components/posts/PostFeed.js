import React, { Component } from 'react';
import propTypes from 'prop-types';

import PostItem from './PostItem';

class PostFeed extends Component {
  render() {
    const { posts } = this.props;

    return posts.map(post => <PostItem key={post._id} post={post} />);
  }
}

PostFeed.propTypes = {
  posts: propTypes.instanceOf(Array).isRequired
};

export default PostFeed;
