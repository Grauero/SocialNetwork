import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { PostItem } from '../../../src/components/posts/PostItem';

const id = 'id';
const props = {
  auth: { user: { id } },
  showActions: true,
  post: {
    _id: 'postId',
    avatar: 'avatar',
    name: 'name',
    text: 'text',
    user: id,
    likes: [{ user: id }, {}]
  },
  deletePost: jest.fn(),
  addLike: jest.fn(),
  removeLike: jest.fn()
};

const component = mount(
  <BrowserRouter>
    <PostItem {...props} />
  </BrowserRouter>
);

it('calls onLikeClick by pressing like button', () => {
  const likeButton = component.find('button').get(0);
  likeButton.props.onClick();

  expect(props.addLike).toHaveBeenCalled();
  expect(props.addLike).toHaveBeenCalledTimes(1);
  expect(props.addLike).toHaveBeenCalledWith(props.post._id);
});

it('calls onUnlikeClick by pressing unlike button', () => {
  const unlikeButton = component.find('button').get(1);
  unlikeButton.props.onClick();

  expect(props.removeLike).toHaveBeenCalled();
  expect(props.removeLike).toHaveBeenCalledTimes(1);
  expect(props.removeLike).toHaveBeenCalledWith(props.post._id);
});

it('renders delete comment button if user created that post', () => {
  const deleteButton = component.find('button').get(2);

  expect(deleteButton).not.toBeNull();
});

it('calls deletePost by pressing delete post button', () => {
  const deletePostButton = component.find('button').get(2);
  deletePostButton.props.onClick();

  expect(props.deletePost).toHaveBeenCalled();
  expect(props.deletePost).toHaveBeenCalledTimes(1);
  expect(props.deletePost).toHaveBeenCalledWith(props.post._id);
});

it('didnt renders delete post button if user did NOT created that post', () => {
  const usersProps = Object.assign({}, props, {
    post: { user: 'testId', likes: [{ user: id }, {}] }
  });
  const component = mount(
    <BrowserRouter>
      <PostItem {...usersProps} />
    </BrowserRouter>
  );
  const deleteButton = component.find('button').get(2);

  expect(deleteButton).toBeFalsy();
});

it('didnt renders action buttons if showAction equals false', () => {
  const usersProps = Object.assign({}, props, { showActions: false });
  const component = mount(
    <BrowserRouter>
      <PostItem {...usersProps} />
    </BrowserRouter>
  );
  const actionButtons = component.find('button');

  expect(actionButtons.get(0)).toBeFalsy();
  expect(actionButtons.get(1)).toBeFalsy();
  expect(actionButtons.get(2)).toBeFalsy();
});
