import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import ProfileActions from '../../../src/components/dashboard/ProfileActions';

const component = mount(
  <BrowserRouter>
    <ProfileActions />
  </BrowserRouter>
);

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
