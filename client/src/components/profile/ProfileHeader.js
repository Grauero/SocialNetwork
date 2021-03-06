import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

import isEmpty from '../../validation/isEmpty';

const ProfileHeader = ({ profile }) => (
  <div className="row">
    <div className="col-md-12">
      <div className="card card-body bg-info text-white mb-3">
        <div className="row">
          <div className="col-4 col-md-3 m-auto">
            <img
              className="rounded-circle"
              src={profile.user.avatar}
              alt="User avatar"
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="display-4 text-center">{profile.user.name}</h1>
          <Link to={`/message/${profile._id}`} className="btn btn-dark">
            Send Message
          </Link>
          <p className="lead text-center">
            {profile.status}{' '}
            {isEmpty(profile.company) ? null : (
              <span data-company>at {profile.company}</span>
            )}
          </p>
          {isEmpty(profile.location) ? null : (
            <p data-location>{profile.location}</p>
          )}
          <p>
            {isEmpty(profile.website) ? null : (
              <a
                className="text-white p-2"
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                data-website
                aria-label="users website"
              >
                <i className="fas fa-globe fa-2x" />
              </a>
            )}
            {isEmpty(profile.social && profile.social.twitter) ? null : (
              <a
                className="text-white p-2"
                href={profile.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                data-twitter
                aria-label="users twitter"
              >
                <i className="fab fa-twitter fa-2x" />
              </a>
            )}
            {isEmpty(profile.social && profile.social.facebook) ? null : (
              <a
                className="text-white p-2"
                href={profile.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                data-facebook
                aria-label="users facebook"
              >
                <i className="fab fa-facebook fa-2x" />
              </a>
            )}
            {isEmpty(profile.social && profile.social.linkedin) ? null : (
              <a
                className="text-white p-2"
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-linkedin
                aria-label="users linkedin"
              >
                <i className="fab fa-linkedin  fa-2x" />
              </a>
            )}
            {isEmpty(profile.social && profile.social.youtube) ? null : (
              <a
                className="text-white p-2"
                href={profile.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                data-youtube
                aria-label="users youtube"
              >
                <i className="fab fa-youtube fa-2x" />
              </a>
            )}
            {isEmpty(profile.social && profile.social.instagram) ? null : (
              <a
                className="text-white p-2"
                href={profile.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                data-instagram
                aria-label="users instagramm"
              >
                <i className="fab fa-instagram fa-2x" />
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  </div>
);

ProfileHeader.propTypes = {
  profile: propTypes.instanceOf(Object).isRequired
};

export default ProfileHeader;
