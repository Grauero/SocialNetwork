import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { Login } from '../../../src/components/auth/Login';

const props = {
  auth: { isAuthenticated: false },
  errors: {},
  history: { push: jest.fn() },
  loginUser: jest.fn()
};
const initialState = {
  email: '',
  password: '',
  errors: {}
};

const wrapper = mount(<Login {...props} />);

const component = wrapper.find(Login);
component.setState(initialState);

it('should redirect to /dashboard if user is authenticated', () => {
  const authProps = Object.assign({}, props, {
    auth: { isAuthenticated: true }
  });
  mount(<Login {...authProps} />);

  expect(authProps.history.push).toHaveBeenCalled();
  expect(authProps.history.push).toHaveBeenCalledWith('/dashboard');
});

it('handles form submit', () => {
  const expectedObj = { email: '', password: '' };
  component.find('form').simulate('submit');

  expect(props.loginUser).toHaveBeenCalled();
  expect(props.loginUser).toHaveBeenCalledWith(expectedObj);
  expect(props.loginUser).toHaveBeenCalledTimes(1);
});

it('handles inputs change', () => {
  const name = 'email';
  const value = 'updatedValue';
  const expectedState = Object.assign({}, initialState);
  expectedState[name] = value;

  component
    .find('TextFieldGroup')
    .at(0)
    .find('input')
    .simulate('change', {
      target: { name, value }
    });

  expect(component.state()).toEqual(expectedState);
});

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
