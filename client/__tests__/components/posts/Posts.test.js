import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount } from 'enzyme';

import { Posts } from '../../../src/components/posts/Posts';

const props = {
  post: { posts: [], loading: false },
  getPosts: jest.fn()
};
const store = createStore(() => ({ auth: {} }));
let component;

beforeEach(
  () =>
    (component = mount(
      <Provider store={store}>
        <Posts {...props} />
      </Provider>
    ))
);

afterEach(() => component.unmount());

it('calls getPosts when component is mount', () => {
  expect(props.getPosts).toHaveBeenCalled();
  expect(props.getPosts).toHaveBeenCalledWith();
});

it('renders <PostFeed /> component if posts exists', () => {
  const postFeed = component.find('PostFeed');

  expect(postFeed.debug()).toBeTruthy();
});

it('renders <Spinner /> component if posts doesnt exists', () => {
  const testProps = Object.assign({}, props, {
    post: { posts: null, loading: false }
  });

  const component = mount(
    <Provider store={store}>
      <Posts {...testProps} />
    </Provider>
  );

  const postFeed = component.find('PostFeed');
  const spinner = component.find('Spinner');

  expect(spinner.debug()).toBeTruthy();
  expect(postFeed.debug()).toBeFalsy();
});

it('renders <Spinner /> component if posts is loading', () => {
  const testProps = Object.assign({}, props, {
    post: { posts: [], loading: true }
  });
  const component = mount(
    <Provider store={store}>
      <Posts {...testProps} />
    </Provider>
  );

  const postFeed = component.find('PostFeed');
  const spinner = component.find('Spinner');

  expect(spinner.debug()).toBeTruthy();
  expect(postFeed.debug()).toBeFalsy();
});
