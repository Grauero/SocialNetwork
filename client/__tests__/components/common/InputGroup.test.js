import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import InputGroup from '../../../src/components/common/InputGroup';

const props = {
  name: 'name',
  value: 'value',
  type: 'text',
  onChange: jest.fn()
};
let component;

beforeEach(() => (component = mount(<InputGroup {...props} />)));

afterEach(() => component.unmount());

it('renders correct input with provided props', () => {
  const input = component.find('input');
  const type = input.getDOMNode().getAttribute('type');
  const name = input.getDOMNode().getAttribute('name');
  const value = input.getDOMNode().getAttribute('value');

  expect(type).toBe(props.type);
  expect(name).toBe(props.name);
  expect(value).toBe(props.value);
});

it('handles input change', () => {
  component.find('input').simulate('change');

  expect(props.onChange).toHaveBeenCalled();
  expect(props.onChange).toHaveBeenCalledTimes(1);
});

it('renders error if error is provided with props', () => {
  const propsWithError = Object.assign({}, props, { error: 'Error' });
  const component = mount(<InputGroup {...propsWithError} />);
  const errorDiv = component.find('.invalid-feedback');
  const errorClass = errorDiv.getDOMNode().getAttribute('class');

  expect(errorDiv.debug()).toBeTruthy();
  expect(errorClass).toBe('invalid-feedback');
});

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
