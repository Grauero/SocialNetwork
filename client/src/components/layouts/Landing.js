import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Developer Network</h1>
                <p className="lead">
                  Create a developer profile/portfolio, message other people,
                  share posts and exchange views with other developers
                </p>
                <hr />
                <Link
                  to="/register"
                  className="btn btn-lg btn-light mr-2 signup"
                >
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: propTypes.instanceOf(Object).isRequired,
  history: propTypes.instanceOf(Object).isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export { Landing };
export default connect(mapStateToProps)(Landing);
