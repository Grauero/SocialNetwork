import React from 'react';
import { mount } from 'enzyme';

import TextFieldGroup from '../../../src/components/common/TextFieldGroup';

const props = {
  name: 'name',
  value: 'value',
  type: 'text',
  onChange: jest.fn()
};
let component;

beforeEach(() => (component = mount(<TextFieldGroup {...props} />)));

afterEach(() => component.unmount());

it('renders correct input with provided props', () => {
  const input = component.find('input');
  const name = input.getDOMNode().getAttribute('name');
  const value = input.getDOMNode().getAttribute('value');

  expect(name).toBe(props.name);
  expect(value).toBe(props.value);
});

it('renders info if props.info is provided', () => {
  const infoProps = Object.assign({}, props, { info: 'info' });
  const component = mount(<TextFieldGroup {...infoProps} />);
  const infoElement = component.find('small');

  expect(infoElement.debug()).toBeTruthy();
});

it('renders error if props.error is provided', () => {
  const errorProps = Object.assign({}, props, { error: 'error' });
  const component = mount(<TextFieldGroup {...errorProps} />);
  const errorElement = component.find('.invalid-feedback');

  expect(errorElement.debug()).toBeTruthy();
});
