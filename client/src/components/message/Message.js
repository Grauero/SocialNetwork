import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { deleteMessage } from '../../store/actions/profileActions';

const Message = ({ id, from, to, title, message, deleteMessage }) => {
  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-12">
          <h4>
            <Link to={`/profile/${from.handle}`} className="badge badge-info">
              From: {from.handle}
            </Link>
          </h4>
          <i
            className="far fa-trash-alt text-info mr-1 fa-2x"
            onClick={() => deleteMessage(id)}
          />
          <h4>
            <Link to={`/profile/${to.handle}`} className="badge badge-info">
              To: {to.handle}
            </Link>
          </h4>
          <h5 className="text-center">Title: {title}</h5>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  id: PropTypes.string.isRequired,
  from: PropTypes.instanceOf(Object).isRequired,
  to: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  deleteMessage: PropTypes.func.isRequired
};

export { Message };
export default connect(
  null,
  { deleteMessage }
)(Message);
