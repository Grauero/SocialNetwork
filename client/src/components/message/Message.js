import React from 'react';

const Message = ({ from, to, title, message }) => {
  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-12">
          <h4>
            <a href=" ">From: {from}</a>
          </h4>
          <br />
          <h4>
            <a href=" ">To: {to}</a>
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
