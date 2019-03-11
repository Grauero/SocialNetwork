import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { deleteComment } from '../../store/actions/postActions';

const CommentItem = ({ auth, comment, postId, deleteComment }) => {
  const onDeleteClick = (postId, commentId) => deleteComment(postId, commentId);

  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-2">
          <Link to={`/profile/${comment.name}`} aria-label="users profile">
            <img
              className="rounded-circle d-none d-md-block"
              src={comment.avatar}
              alt="User avatar"
            />
          </Link>
          <br />
          <p className="text-center">{comment.name}</p>
        </div>
        <div className="col-md-10">
          <p className="lead">{comment.text}</p>
          {comment.user === auth.user.id ? (
            <button
              type="button"
              aria-label="delete comment"
              className="btn btn-danger mr-1"
              onClick={() => onDeleteClick(postId, comment._id)}
            >
              <i className="fas fa-times" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  auth: propTypes.instanceOf(Object).isRequired,
  comment: propTypes.instanceOf(Object).isRequired,
  postId: propTypes.string.isRequired,
  deleteComment: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export { CommentItem };
export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
