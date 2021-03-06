import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../../store/actions/authActions';
import { clearCurrentProfile } from '../../store/actions/profileActions';

const Navbar = ({
  auth: { isAuthenticated, user },
  logoutUser,
  clearCurrentProfile
}) => {
  const onLogoutClick = e => {
    e.preventDefault();
    clearCurrentProfile();
    logoutUser();
  };

  const authLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/feed">
          Post Feed
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <a href=" " onClick={onLogoutClick} className="nav-link" aria-label="logout">
          <img
            className="rounded-circle"
            src={user.avatar}
            alt={user.name}
            title="This site uses Gravatar for profile image"
            style={{ width: '25px', marginRight: '5px' }}
          />
          <span className="ml-3">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-light navbar-expand-md mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DevNetwork
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="menu"
          data-toggle="collapse"
          data-target="#mobile-nav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mobile-nav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/profiles">
                Developers
              </Link>
            </li>
          </ul>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  auth: propTypes.instanceOf(Object).isRequired,
  logoutUser: propTypes.func.isRequired,
  clearCurrentProfile: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export { Navbar };
export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(Navbar);
