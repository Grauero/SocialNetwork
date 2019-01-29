import React from 'react';
import { mount } from 'enzyme';

import SelectListGroup from '../../../src/components/common/SelectListGroup';

const props = {
  name: 'name',
  value: 'value',
  onChange: jest.fn(),
  options: []
};
let component;

beforeEach(() => (component = mount(<SelectListGroup {...props} />)));

afterEach(() => component.unmount());

it('renders correct select list with provided props', () => {
  const select = component.find('select');
  const name = select.getDOMNode().getAttribute('name');

  expect(name).toBe(props.name);
});

it('renders info if props.info is provided', () => {
  const infoProps = Object.assign({}, props, { info: 'info' });
  const component = mount(<SelectListGroup {...infoProps} />);
  const infoElement = component.find('small');

  expect(infoElement.debug()).toBeTruthy();
});

it('renders error if props.error is provided', () => {
  const errorProps = Object.assign({}, props, { error: 'error' });
  const component = mount(<SelectListGroup {...errorProps} />);
  const errorElement = component.find('.invalid-feedback');

  expect(errorElement.debug).toBeTruthy();
});
