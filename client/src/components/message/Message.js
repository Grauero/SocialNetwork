import React from 'react';
import { Link } from 'react-router-dom';

const Message = ({ from, to, title, message }) => {
  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-12">
          <h4>
            <Link to={`/profile/${from.handle}`}>From: {from.handle}</Link>
          </h4>
          <br />
          <h4>
            <Link to={`/profile/${to.handle}`}>To: {to.handle}</Link>
          </h4>
          <br />
          <h5>Title: {title}</h5>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
