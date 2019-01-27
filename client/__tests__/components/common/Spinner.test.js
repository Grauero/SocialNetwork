import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import Spinner from '../../../src/components/common/Spinner';

it('matches snapshot', () => {
  const component = shallow(<Spinner />);

  expect(toJSON(component)).toMatchSnapshot();
});
