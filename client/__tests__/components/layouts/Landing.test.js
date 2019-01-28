import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { Landing } from '../../../src/components/layouts/Landing';

const props = {
  auth: { isAuthenticated: true },
  history: { push: jest.fn() }
};
const store = createStore(() => {});

const wrapper = mount(
  <BrowserRouter>
    <Provider store={store}>
      <Landing {...props} />
    </Provider>
  </BrowserRouter>
);
const component = wrapper.find(Landing);

it('redirects to /dashboard if user is authenticated', () => {
  expect(props.history.push).toHaveBeenCalled();
  expect(props.history.push).toHaveBeenCalledTimes(1);
  expect(props.history.push).toHaveBeenCalledWith('/dashboard');
});

it('should render markup if user isnt authenticated', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
