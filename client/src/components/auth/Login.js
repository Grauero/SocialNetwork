import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginUser } from '../../store/actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.auth.isAuthenticated) {
      props.history.push('/dashboard');
    }

    if (props.errors) {
      return {
        ...state,
        errors: props.errors
      };
    }

    return null;
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    const { email, password, errors } = this.state;

    return (
      <div className="login" style={{ minHeight: '100vh', paddingTop: '7em' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevNetwork account
              </p>
              <form action="dashboard.html" onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  auth: propTypes.instanceOf(Object).isRequired,
  errors: propTypes.instanceOf(Object).isRequired,
  history: propTypes.instanceOf(Object).isRequired,
  loginUser: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export { Login };
export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
