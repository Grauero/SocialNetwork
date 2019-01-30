import React from 'react';
import propTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileCreds = ({ experience, education }) => {
  const experienceItems = experience.map(exp => (
    <li key={exp._id} className="list-group-item">
      <h4>{exp.company}</h4>
      <p>
        <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
        {exp.to === null ? (
          'Now'
        ) : (
          <Moment format="YYYY/MM/DD" data-to>
            {exp.to}
          </Moment>
        )}
      </p>
      <p>
        <strong>Position: </strong>
        {exp.title}
      </p>
      <p>
        {exp.location === '' ? null : (
          <span data-location>
            <strong>Location: </strong>
            {exp.location}
          </span>
        )}
      </p>
      <p>
        {exp.description === '' ? null : (
          <span data-description>
            <strong>Description: </strong>
            {exp.description}
          </span>
        )}
      </p>
    </li>
  ));
  const educationItems = education.map(edu => (
    <li key={edu._id} className="list-group-item">
      <h4>{edu.school}</h4>
      <p>
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
        {edu.to === null ? (
          'Now'
        ) : (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        )}
      </p>
      <p>
        <strong>Degree: </strong>
        {edu.degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {edu.fieldOfStudy}
      </p>
      <p>
        {edu.description === '' ? null : (
          <span data-description>
            <strong>Description: </strong>
            {edu.description}
          </span>
        )}
      </p>
    </li>
  ));

  return (
    <div className="row">
      <div className="col-md-6">
        <h3 className="text-center text-info">Experience</h3>
        {experienceItems.length > 0 ? (
          <ul className="list-group" data-experience>
            {experienceItems}
          </ul>
        ) : (
          <p className="text-center">No experience provided</p>
        )}
      </div>

      <div className="col-md-6">
        <h3 className="text-center text-info">Education</h3>
        {educationItems.length > 0 ? (
          <ul className="list-group" data-education>
            {educationItems}
          </ul>
        ) : (
          <p className="text-center">No education provided</p>
        )}
      </div>
    </div>
  );
};

ProfileCreds.propTypes = {
  experience: propTypes.instanceOf(Array).isRequired,
  education: propTypes.instanceOf(Array).isRequired
};

export default ProfileCreds;
