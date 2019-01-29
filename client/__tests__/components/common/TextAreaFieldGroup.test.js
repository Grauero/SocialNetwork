import React from 'react';
import { mount } from 'enzyme';

import TextAreaFieldGroup from '../../../src/components/common/TextAreaFieldGroup';

const props = {
  name: 'name',
  value: 'value',
  onChange: jest.fn()
};
let component;

beforeEach(() => (component = mount(<TextAreaFieldGroup {...props} />)));

afterEach(() => component.unmount());

it('renders correct textarea with provided props', () => {
  const textarea = component.find('textarea');
  const name = textarea.getDOMNode().getAttribute('name');

  expect(name).toBe(props.name);
});

it('renders info if props.info is provided', () => {
  const infoProps = Object.assign({}, props, { info: 'info' });
  const component = mount(<TextAreaFieldGroup {...infoProps} />);
  const infoElement = component.find('small');

  expect(infoElement.debug()).toBeTruthy();
});

it('renders error if props.error is provided', () => {
  const errorProps = Object.assign({}, props, { error: 'error' });
  const component = mount(<TextAreaFieldGroup {...errorProps} />);
  const errorElement = component.find('.invalid-feedback');

  expect(errorElement.debug()).toBeTruthy();
});
