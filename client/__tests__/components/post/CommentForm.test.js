import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { CommentForm } from '../../../src/components/post/CommentForm';

const props = {
  auth: { user: { name: 'name', avatar: 'avatar' } },
  postId: 'postId',
  addComment: jest.fn()
};
const initialState = {
  text: 'text',
  errors: {}
};

const wrapper = mount(
  <BrowserRouter>
    <CommentForm {...props} />
  </BrowserRouter>
);
const component = wrapper.find(CommentForm);
component.setState(initialState);

it('handles form submit', () => {
  const expectedObj = {
    text: initialState.text,
    name: props.auth.user.name,
    avatar: props.auth.user.avatar
  };
  component.find('form').simulate('submit');

  expect(props.addComment).toHaveBeenCalled();
  expect(props.addComment).toHaveBeenCalledWith(props.postId, expectedObj);
  expect(props.addComment).toHaveBeenCalledTimes(1);
  component.setState(initialState); // reset components state to initial
});

it('clears state after submitting the form', () => {
  component.find('form').simulate('submit');
  expect(component.state().text).toBe('');
  component.setState(initialState); // reset components state to initial
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
  component.setState(initialState); // reset components state to initial
});
