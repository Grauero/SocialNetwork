import React from 'react';
import propTypes from 'prop-types';

import CommentItem from './CommentItem';

const ComponentFeed = ({ comments, postId }) => (
  comments.map(comment => (
    <CommentItem key={comment._id} comment={comment} postId={postId} />
  ))
);

ComponentFeed.propTypes = {
  comments: propTypes.instanceOf(Array).isRequired,
  postId: propTypes.string.isRequired
};

export default ComponentFeed;
