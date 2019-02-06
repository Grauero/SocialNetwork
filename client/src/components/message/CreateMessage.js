import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import Spinner from '../common/Spinner';
import {
  sendMessage,
  getCurrentProfile
} from '../../store/actions/profileActions';

class CreateMessage extends Component {
  state = {
    title: '',
    message: ''
  };

  async componentDidMount() {
    await this.props.getCurrentProfile();
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const from = this.props.profile.profile._id;
    const to = this.props.match.params.receiver;
    const title = this.state.title;
    const message = this.state.message;

    const payload = {
      from,
      to,
      title,
      message
    };

    this.props.sendMessage(payload, this.props.history);
  };

  render() {
    const { profile, loading } = this.props.profile;
    let messageForm;

    if (profile === null || loading) {
      messageForm = <Spinner />;
    } else {
      messageForm = (
        <form onSubmit={this.onSubmit}>
          <TextFieldGroup
            placeholder="Message Title"
            name="title"
            value={this.state.title}
            onChange={this.onChange}
          />
          <TextAreaFieldGroup
            placeholder="Message"
            name="message"
            value={this.state.message}
            onChange={this.onChange}
          />
          <input
            type="submit"
            value="Send Message"
            className="btn btn-info btn-block mt-4"
          />
        </form>
      );
    }
    return <div>{messageForm} </div>;
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { sendMessage, getCurrentProfile }
)(withRouter(CreateMessage));
