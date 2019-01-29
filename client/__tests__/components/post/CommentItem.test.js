import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { CommentItem } from '../../../src/components/post/CommentItem';

const id = 'id';
const props = {
  auth: { user: { id } },
  comment: {
    _id: 'commentId',
    avatar: 'avatar',
    name: 'name',
    text: 'text',
    user: id
  },
  postId: 'postId',
  deleteComment: jest.fn()
};
let component;

beforeEach(
  () =>
    (component = mount(
      <BrowserRouter>
        <CommentItem {...props} />
      </BrowserRouter>
    ))
);

afterEach(() => component.unmount());

it('renders delete comment button if user created that comment', () => {
  const deleteButton = component.find('button');

  expect(deleteButton).toBeDefined();
});

it('calls deleteComment by pressing delete comment button', () => {
  component.find('button').simulate('click');

  expect(props.deleteComment).toHaveBeenCalled();
  expect(props.deleteComment).toHaveBeenCalledTimes(1);
  expect(props.deleteComment).toHaveBeenCalledWith(
    props.postId,
    props.comment._id
  );
});

it('didnt renders delete comment button if user did NOT created that comment', () => {
  const usersProps = Object.assign({}, props, { comment: { user: 'testId' } });
  const component = mount(
    <BrowserRouter>
      <CommentItem {...usersProps} />
    </BrowserRouter>
  );
  const deleteButton = component.find('button');

  expect(deleteButton.debug()).toBeFalsy();
});
