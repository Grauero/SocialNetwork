import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: propTypes.instanceOf(Object).isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export { PrivateRoute };
export default connect(mapStateToProps)(PrivateRoute);
