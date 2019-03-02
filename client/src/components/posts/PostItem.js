import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import {
  deletePost,
  addLike,
  removeLike
} from '../../store/actions/postActions';

const PostItem = ({
  post,
  auth,
  showActions,
  deletePost,
  addLike,
  removeLike
}) => {
  const onDeleteClick = id => deletePost(id);
  const onLikeClick = id => addLike(id);
  const onUnlikeClick = id => removeLike(id);
  const findUserLike = likes => {
    return likes.filter(like => like.user === auth.user.id).length > 0;
  };

  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-2">
          <a href="profile.html">
            <img
              className="rounded-circle d-none d-md-block"
              src={post.avatar}
              alt="User Avatar"
            />
          </a>
          <br />
          <p className="text-center">{post.name}</p>
        </div>
        <div className="col-md-10">
          <p className="lead">{post.text}</p>
          {showActions ? (
            <span>
              <button
                onClick={() => onLikeClick(post._id)}
                type="button"
                aria-label="like"
                className="btn btn-light mr-1"
              >
                <i
                  className={classnames('fas fa-thumbs-up', {
                    'text-info': findUserLike(post.likes)
                  })}
                />
                <span className="badge badge-light">{post.likes.length}</span>
              </button>
              <button
                onClick={() => onUnlikeClick(post._id)}
                type="button"
                aria-label="unlike"
                className="btn btn-light mr-1"
              >
                <i className="text-secondary fas fa-thumbs-down" />
              </button>
              <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                Comments
              </Link>
              {post.user === auth.user.id ? (
                <button
                  type="button"
                  aria-label="delete post"
                  className="btn btn-danger mr-1"
                  onClick={() => onDeleteClick(post._id)}
                >
                  <i className="fas fa-times" />
                </button>
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

PostItem.propTypes = {
  post: propTypes.instanceOf(Object).isRequired,
  auth: propTypes.instanceOf(Object).isRequired,
  showActions: propTypes.bool,
  deletePost: propTypes.func.isRequired,
  addLike: propTypes.func.isRequired,
  removeLike: propTypes.func.isRequired
};

PostItem.defaultProps = {
  showActions: true
};

const mapStateToProps = state => ({
  auth: state.auth
});

export { PostItem };
export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike }
)(PostItem);
