import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';

import { Post } from '../../../src/components/post/Post';

const props = {
  match: { params: { id: 'id' } },
  post: { post: { _id: 'id', comments: [] }, loading: false },
  getPost: jest.fn()
};

const component = shallow(<Post {...props} />);

it('renders <ComponentFeed /> component if post exists', () => {
  const feed = component.find('ComponentFeed');

  expect(feed.debug()).not.toBeFalsy();
});

it('renders <Spinner /> component if post doesnt exists', () => {
  const testProps = Object.assign({}, props, { post: { post: null } });
  const store = createStore(() => ({ auth: {} }));

  const component = mount(
    <BrowserRouter>
      <Provider store={store}>
        <Post {...testProps} />
      </Provider>
    </BrowserRouter>
  );
  const spinner = component.find('Spinner');

  expect(spinner.debug()).not.toBeFalsy();
});

it('renders <Spinner /> component if post is loading', () => {
  const testProps = Object.assign({}, props, { post: { loading: true } });
  const store = createStore(() => ({ auth: {} }));

  const component = mount(
    <BrowserRouter>
      <Provider store={store}>
        <Post {...testProps} />
      </Provider>
    </BrowserRouter>
  );
  const spinner = component.find('Spinner');

  expect(spinner.debug()).not.toBeFalsy();
});

it('renders <Spinner /> component if post is empty', () => {
  const testProps = Object.assign({}, props, { post: { post: {} } });
  const store = createStore(() => ({ auth: {} }));

  const component = mount(
    <BrowserRouter>
      <Provider store={store}>
        <Post {...testProps} />
      </Provider>
    </BrowserRouter>
  );
  const spinner = component.find('Spinner');

  expect(spinner.debug()).not.toBeFalsy();
});

it('calls getPost when component is mount', () => {
  const store = createStore(() => ({ auth: {} }));
  mount(
    <BrowserRouter>
      <Provider store={store}>
        <Post {...props} />
      </Provider>
    </BrowserRouter>
  );

  expect(props.getPost).toHaveBeenCalled();
  expect(props.getPost).toHaveBeenCalledWith('id');
});
