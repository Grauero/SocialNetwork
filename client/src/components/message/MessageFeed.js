import React, { Component } from 'react';
import { connect } from 'react-redux';

import Message from './Message';
import Spinner from '../common/Spinner';
import { getCurrentProfile } from '../../store/actions/profileActions';

class MessageFeed extends Component {
  async componentDidMount() {
    await this.props.getCurrentProfile();
  }

  render() {
    const { profile, loading } = this.props.profile;
    let messages;

    if (profile === null || loading) {
      messages = <Spinner />;
    } else {
      messages = this.props.profile.profile.messages.map(message => (
        <Message
          key={message._id}
          from={message.from}
          to={message.to}
          message={message.message}
          title={message.title}
        />
      ));
    }

    return <div>{messages}</div>;
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(MessageFeed);