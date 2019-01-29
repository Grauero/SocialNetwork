import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter, Redirect } from 'react-router-dom';

import { PrivateRoute } from '../../../src/components/common/PrivateRoute';
import NotFound from '../../../src/components/not-found/NotFound';

const props = {
  component: NotFound,
  auth: { isAuthenticated: false }
};
let component;

beforeEach(
  () =>
    (component = mount(
      <BrowserRouter>
        <PrivateRoute {...props} />
      </BrowserRouter>
    ))
);

afterEach(() => component.unmount());

it('renders child component if user is authenticated', () => {
  const testProps = Object.assign({}, props, {
    auth: { isAuthenticated: true }
  });
  const component = mount(
    <BrowserRouter>
      <PrivateRoute {...testProps} />
    </BrowserRouter>
  );
  const testComponent = component.find(NotFound);

  expect(testComponent.debug()).toBeTruthy();
});

it('renders <Redirect to="/login" /> component if user is NOT authenticated', () => {
  const redirectComponent = component.find(Redirect);

  expect(redirectComponent.debug()).toBeTruthy();
  expect(redirectComponent.debug()).toBe(
    '<Redirect to="/login" push={false} />'
  );
});
