import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { Register } from '../../../src/components/auth/Register';

const props = {
  auth: { isAuthenticated: false },
  errors: {},
  history: { push: jest.fn() },
  registerUser: jest.fn()
};
const initialState = {
  name: '',
  email: '',
  password: '',
  password2: '',
  errors: {}
};

const wrapper = mount(<Register {...props} />);

const component = wrapper.find(Register);
component.setState(initialState);

it('should redirect to /dashboard if user is authenticated', () => {
  const authProps = Object.assign({}, props, {
    auth: { isAuthenticated: true }
  });
  mount(<Register {...authProps} />);

  expect(authProps.history.push).toHaveBeenCalled();
  expect(authProps.history.push).toHaveBeenCalledWith('/dashboard');
});

it('handles form submit', () => {
  const expectedObj = { email: '', name: '', password: '', password2: '' };
  component.find('form').simulate('submit');

  expect(props.registerUser).toHaveBeenCalled();
  expect(props.registerUser).toHaveBeenCalledWith(expectedObj, props.history);
  expect(props.registerUser).toHaveBeenCalledTimes(1);
});

it('handles inputs change', () => {
  const input = component
    .find('TextFieldGroup')
    .at(0)
    .find('input');
  const name = 'name';
  const value = 'updatedValue';
  const expectedState = Object.assign({}, initialState);
  expectedState[name] = value;

  input.simulate('change', {
    target: { name, value }
  });

  expect(component.state()).toEqual(expectedState);
});

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
