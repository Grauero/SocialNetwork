import * as actionCreators from '../../../../src/store/actions/postActions';
import { GET_POSTS, POST_LOADING } from '../../../../src/store/types';
import { mock, store } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onGet('/api/posts').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make GET request to /api/posts', async () => {
  await store.dispatch(actionCreators.getPosts());

  expect(mock.history.get[0].url).toBe('/api/posts');
});

it('should dispatch action POST_LOADING', async () => {
  const expectedAction = { type: POST_LOADING };
  await store.dispatch(actionCreators.getPosts());

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('should dispatch action GET_POSTS', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_POSTS };
  await store.dispatch(actionCreators.getPosts());

  expect(store.getActions()[1]).toEqual(expectedAction);
});

it('should dispatch action GET_POSTS if error is happened', async () => {
  const expectedAction = { payload: null, type: GET_POSTS };
  mock.onGet('/api/posts').reply(404);
  await store.dispatch(actionCreators.getPosts());

  expect(store.getActions()[1]).toEqual(expectedAction);
});
