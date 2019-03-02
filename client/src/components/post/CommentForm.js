import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addComment } from '../../store/actions/postActions';

class CommentForm extends Component {
  state = {
    text: '',
    errors: {}
  };

  static getDerivedStateFromProps(props, state) {
    if (props.errors) {
      return {
        ...state,
        errors: props.errors
      };
    }

    return null;
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const { user } = this.props.auth;
    const { postId } = this.props;

    const newComment = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    };
    this.props.addComment(postId, newComment);

    this.setState({ text: '' });
  };

  render() {
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Write a comment</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Reply to post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={this.state.errors.text}
                />
              </div>
              <button
                type="submit"
                aria-label="submit form"
                className="btn btn-dark"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  auth: propTypes.instanceOf(Object).isRequired,
  postId: propTypes.string.isRequired,
  addComment: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export { CommentForm };
export default connect(
  mapStateToProps,
  { addComment }
)(CommentForm);
