import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      messages = profile.messages
        .reverse()
        .map(message => (
          <Message
            key={message._id}
            id={message._id}
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

MessageFeed.propTypes = {
  profile: PropTypes.instanceOf(Object).isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export { MessageFeed };
export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(MessageFeed);
