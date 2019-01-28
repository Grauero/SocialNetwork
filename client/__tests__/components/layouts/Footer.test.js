import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import Footer from '../../../src/components/layouts/Footer';

const component = mount(<Footer />);

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
