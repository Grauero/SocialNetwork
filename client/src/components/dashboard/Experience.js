import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { deleteExperience } from '../../store/actions/profileActions';

const Experience = ({ experience, deleteExperience }) => {
  const onDeleteClick = id => deleteExperience(id);

  const experiences = experience.map(exp => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td>{exp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
        {exp.to === null ? (
          ' Now'
        ) : (
          <Moment format="YYYY/MM/DD">{exp.to}</Moment>
        )}
      </td>
      <td>
        <button
          type="button"
          aria-label="delete experience"
          onClick={() => onDeleteClick(exp._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div>
      <h4 className="mb-4">Experience Credentials</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Title</th>
            <th>Years</th>
            <th />
          </tr>
          {experiences}
        </thead>
      </table>
    </div>
  );
};

Experience.propTypes = {
  experience: propTypes.instanceOf(Object).isRequired,
  deleteExperience: propTypes.func.isRequired
};

export { Experience };
export default connect(
  null,
  { deleteExperience }
)(Experience);
