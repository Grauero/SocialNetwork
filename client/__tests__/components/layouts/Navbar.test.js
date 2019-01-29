import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { Navbar } from '../../../src/components/layouts/Navbar';

const props = {
  auth: { isAuthenticated: true, user: {} },
  logoutUser: jest.fn(),
  clearCurrentProfile: jest.fn()
};
let component;

beforeEach(
  () =>
    (component = mount(
      <BrowserRouter>
        <Navbar {...props} />
      </BrowserRouter>
    ))
);

afterEach(() => component.unmount());

it('calls clearCurrentProfile and logoutUser by pressing logout button', () => {
  const logoutButton = component.find('a').get(4);
  logoutButton.props.onClick({ preventDefault: jest.fn() });

  expect(props.clearCurrentProfile).toHaveBeenCalled();
  expect(props.clearCurrentProfile).toHaveBeenCalledTimes(1);
  expect(props.logoutUser).toHaveBeenCalled();
  expect(props.logoutUser).toHaveBeenCalledTimes(1);
});

it('should render auth links if user is authenticated', () => {
  const authLinks = component.find('Link');

  expect(toJSON(authLinks)).toMatchSnapshot();
});

it('should render guest links if user is NOT authenticated', () => {
  const guestLinks = component.find('Link');

  expect(toJSON(guestLinks)).toMatchSnapshot();
});
