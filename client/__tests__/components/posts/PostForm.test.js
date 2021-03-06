import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { PostForm } from '../../../src/components/posts/PostForm';

const props = {
  auth: { user: { name: 'name', avatar: 'avatar' } },
  addPost: jest.fn()
};
const initialState = {
  text: 'text',
  errors: {}
};
let wrapper, component;

beforeEach(() => {
  wrapper = mount(
    <BrowserRouter>
      <PostForm {...props} />
    </BrowserRouter>
  );
  component = wrapper.find(PostForm);
  component.setState(initialState);
});

afterEach(() => wrapper.unmount());

it('handles form submit', () => {
  const expectedObj = {
    text: initialState.text,
    name: props.auth.user.name,
    avatar: props.auth.user.avatar
  };

  component.find('form').simulate('submit');

  expect(props.addPost).toHaveBeenCalled();
  expect(props.addPost).toHaveBeenCalledWith(expectedObj);
  expect(props.addPost).toHaveBeenCalledTimes(1);
});

it('clears state after submitting the form', () => {
  component.find('form').simulate('submit');

  expect(component.state().text).toBe('');
});

it('handles textarea change', () => {
  const name = 'text';
  const value = 'updatedValue';
  const expectedState = Object.assign({}, initialState);
  expectedState[name] = value;

  component
    .find('TextAreaFieldGroup')
    .at(0)
    .find('textarea')
    .simulate('change', {
      target: { name, value }
    });

  expect(component.state()).toEqual(expectedState);
});
