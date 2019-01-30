import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost } from '../../store/actions/postActions';

class PostForm extends Component {
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

    const newUser = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    };
    this.props.addPost(newUser);

    this.setState({ text: '' });
  };

  render() {
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Something...</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={this.state.errors.text}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  auth: propTypes.instanceOf(Object).isRequired,
  addPost: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export { PostForm };
export default connect(
  mapStateToProps,
  { addPost }
)(PostForm);
