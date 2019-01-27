import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import toJSON from 'enzyme-to-json';

import { AddEducation } from '../../../src/components/add-credentials/AddEducation';

const props = {
  errors: {},
  history: { history: 'test' },
  addEducation: jest.fn()
};
const initialState = {
  school: 'school',
  degree: 'degree',
  fieldOfStudy: 'field',
  from: 'from',
  to: 'to',
  current: false,
  description: 'desc',
  errors: {},
  disabled: false
};

const wrapper = mount(
  <BrowserRouter>
    <AddEducation {...props} />
  </BrowserRouter>
);

const component = wrapper.find(AddEducation);
component.setState(initialState);

it('handles form submit', () => {
  const expectedObj = {
    current: false,
    degree: 'degree',
    description: 'desc',
    fieldOfStudy: 'field',
    from: 'from',
    school: 'school',
    to: 'to'
  };
  component.find('form').simulate('submit');

  expect(props.addEducation).toHaveBeenCalled();
  expect(props.addEducation).toHaveBeenCalledWith(expectedObj, props.history);
  expect(props.addEducation).toHaveBeenCalledTimes(1);
});

it('handles inputs change', () => {
  const input = component
    .find('TextFieldGroup')
    .at(0)
    .find('input');

  const name = 'school';
  const value = 'updatedValue';
  const expectedState = Object.assign({}, initialState);
  expectedState[name] = value;

  input.simulate('change', {
    target: { name, value }
  });

  expect(component.state()).toEqual(expectedState);
});

it('handles checkboxs change', () => {
  const checkbox = component
    .find('input[type="checkbox"]')
    .at(0)
    .find('input');

  const name = 'current';
  const value = false;

  checkbox.simulate('change', {
    target: { name, value }
  });

  expect(component.state().disabled).toBe(true);
  expect(component.state().disabled).not.toBe(initialState.disabled);

  expect(component.state().current).toBe(true);
  expect(component.state().current).not.toBe(initialState.current);
});

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
