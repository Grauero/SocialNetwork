import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { deleteEducation } from '../../store/actions/profileActions';

const Education = ({ education, deleteEducation }) => {
  const onDeleteClick = id => deleteEducation(id);

  const educations = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td>{edu.degree}</td>
      <td>
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
        {edu.to === null ? (
          ' Now'
        ) : (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        )}
      </td>
      <td>
        <button
          type="button"
          onClick={() => onDeleteClick(edu._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div>
      <h4 className="mb-4">Education Credentials</h4>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th>Degree</th>
            <th>Years</th>
            <th />
          </tr>
          {educations}
        </thead>
      </table>
    </div>
  );
};

Education.propTypes = {
  education: propTypes.instanceOf(Object).isRequired,
  deleteEducation: propTypes.func.isRequired
};

export { Education };
export default connect(
  null,
  { deleteEducation }
)(Education);
