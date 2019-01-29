import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { EditProfile } from '../../../src/components/edit-profile/EditProfile';

const props = {
  errors: {},
  history: { history: 'test' },
  profile: {},
  createProfile: jest.fn(),
  getCurrentProfile: jest.fn()
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
let wrapper, component;

beforeEach(() => {
  wrapper = mount(
    <BrowserRouter>
      <EditProfile {...props} />
    </BrowserRouter>
  );
  component = wrapper.find(EditProfile);
  component.setState(initialState);
});

afterEach(() => wrapper.unmount());

it('calls getCurrentProfile when component is rendered', () => {
  expect(props.getCurrentProfile).toHaveBeenCalled();
});

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
  component.setState(state);

  const socialDiv = component.find('div[data-social]');

  expect(socialDiv).toBeTruthy();
});

it('toggles social input by pressing button', () => {
  const expectedState = Object.assign({}, initialState, {
    displaySocialInputs: !initialState.displaySocialInputs
  });

  component.find('button').simulate('click');

  expect(component.state()).toEqual(expectedState);
});
