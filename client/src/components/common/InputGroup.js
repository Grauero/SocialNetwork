import React from 'react';
import propTypes from 'prop-types';
import classnames from 'classnames';

const InputGroup = ({
  name,
  placeholder,
  value,
  error,
  onChange,
  icon,
  type
}) => (
  <div className="input-group mb-3">
    <div className="input-group-prepend">
      <span className="input-group-text">
        <i className={icon} />
      </span>
    </div>
    <input
      type={type}
      className={classnames('form-control form-control-lg', {
        'is-invalid': error
      })}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

InputGroup.propTypes = {
  name: propTypes.string.isRequired,
  placeholder: propTypes.string,
  value: propTypes.string.isRequired,
  icon: propTypes.string,
  type: propTypes.string,
  error: propTypes.string,
  onChange: propTypes.func.isRequired
};

InputGroup.defaultProps = {
  placeholder: null,
  icon: null,
  error: null,
  type: 'text'
};

export default InputGroup;
