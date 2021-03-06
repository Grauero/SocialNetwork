import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import ProfileGithub from './ProfileGithub';
import ProfileHeader from './ProfileHeader';
import Spinner from '../common/Spinner';
import { getProfileByHandle } from '../../store/actions/profileActions';

class Profile extends Component {
  async componentDidMount() {
    if (this.props.match.params.handle) {
      await this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link>
            </div>
            <div className="col-md-6" />
          </div>
          <ProfileHeader profile={profile} />
          <ProfileAbout profile={profile} />
          <ProfileCreds
            education={profile.education}
            experience={profile.experience}
          />
          {profile.githubUserName ? (
            <ProfileGithub username={profile.githubUserName} />
          ) : null}
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  profile: propTypes.instanceOf(Object).isRequired,
  match: propTypes.instanceOf(Object).isRequired,
  history: propTypes.instanceOf(Object).isRequired,
  getProfileByHandle: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export { Profile };
export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
