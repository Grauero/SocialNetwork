import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import toJSON from 'enzyme-to-json';

import { AddExperience } from '../../../src/components/add-credentials/AddExperience';

const props = {
  errors: {},
  history: { history: 'test' },
  addExperience: jest.fn()
};
const initialState = {
  company: 'company',
  title: 'title',
  location: 'location',
  from: 'from',
  to: 'to',
  current: false,
  description: 'desc',
  errors: {},
  disabled: false
};

const wrapper = mount(
  <BrowserRouter>
    <AddExperience {...props} />
  </BrowserRouter>
);

const component = wrapper.find(AddExperience);
component.setState(initialState);

it('handles form submit', () => {
  const expectedObj = {
    company: 'company',
    current: false,
    description: 'desc',
    from: 'from',
    location: 'location',
    title: 'title',
    to: 'to'
  };
  component.find('form').simulate('submit');

  expect(props.addExperience).toHaveBeenCalled();
  expect(props.addExperience).toHaveBeenCalledWith(expectedObj, props.history);
  expect(props.addExperience).toHaveBeenCalledTimes(1);
});

it('handles inputs change', () => {
  const name = 'company';
  const value = 'updatedValue';
  const expectedState = Object.assign({}, initialState);
  expectedState[name] = value;

  component
    .find('TextFieldGroup')
    .at(0)
    .find('input')
    .simulate('change', {
      target: { name, value }
    });

  expect(component.state()).toEqual(expectedState);
});

it('handles checkboxs change', () => {
  const name = 'current';
  const value = false;

  component
    .find('input[type="checkbox"]')
    .at(0)
    .find('input')
    .simulate('change', {
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
