import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import NotFound from '../../../src/components/not-found/NotFound';

const component = mount(<NotFound />);

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
