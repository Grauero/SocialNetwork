import React from 'react';
import { mount } from 'enzyme';

import { CreateProfile } from '../../../src/components/create-profile/CreateProfile';

const props = {
  errors: {},
  history: { history: 'test' },
  createProfile: jest.fn()
};
const initialState = {
  displaySocialInputs: false,
  handle: 'handle',
  company: 'company',
  website: 'website',
  location: 'location',
  status: 'status',
  skills: 'skills',
  githubUserName: 'github',
  bio: 'bio',
  twitter: 'twitter',
  facebook: 'facebook',
  linkedin: 'linkedin',
  youtube: 'youtube',
  instagram: 'instagram',
  errors: {}
};
let component;

beforeEach(() => {
  component = mount(<CreateProfile {...props} />);
  component.setState(initialState);
});

afterEach(() => component.unmount());

it('handles form submit', () => {
  const expectedObj = Object.assign({}, initialState);
  delete expectedObj.displaySocialInputs;
  delete expectedObj.errors;

  component.find('form').simulate('submit');

  expect(props.createProfile).toHaveBeenCalled();
  expect(props.createProfile).toHaveBeenCalledWith(expectedObj, props.history);
  expect(props.createProfile).toHaveBeenCalledTimes(1);
});

it('handles inputs change', () => {
  const name = 'handle';
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

it('displays social inputs based on component state', () => {
  const state = Object.assign(initialState, { displaySocialInputs: true });
  const component = mount(<CreateProfile {...props} />);
  component.setState(state);

  const socialDiv = component.find('div[data-social]');

  expect(socialDiv.debug()).toBeTruthy();
});

it('toggles social input by pressing button', () => {
  const oldState = initialState.displaySocialInputs;
  component.find('button').simulate('click');

  expect(component.state().displaySocialInputs).not.toBe(oldState);
});
