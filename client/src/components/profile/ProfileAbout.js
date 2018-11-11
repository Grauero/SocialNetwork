import React from 'react';
import propTypes from 'prop-types';

import isEmpty from '../../validation/isEmpty';

const ProfileAbout = ({ profile }) => {
  const firstName = profile.user.name.trim().split(' ')[0];
  const skills = profile.skills.map(skill => (
    <div key={skill} className="p-3">
      <i className="fa fa-check" /> {skill}
    </div>
  ));

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-body bg-light mb-3">
          <h3 className="text-center text-info">{`${firstName}'s Bio`}</h3>
          <p className="lead">
            {
                isEmpty(profile.bio)
                  ? <span>{firstName} doesnt have a bio</span>
                  : <span>{profile.bio}</span>
              }
          </p>
          <hr />
          <h3 className="text-center text-info">Skill Set</h3>
          <div className="row">
            <div className="d-flex flex-wrap justify-content-center align-items-center">
              {skills}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: propTypes.instanceOf(Object).isRequired
};

export default ProfileAbout;
