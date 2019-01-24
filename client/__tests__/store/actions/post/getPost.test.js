import * as actionCreators from '../../../../src/store/actions/postActions';
import { GET_POST, POST_LOADING } from '../../../../src/store/types';
import { mock, store, id } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onGet(`/api/posts/${id}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make GET request to /api/posts/id', async () => {
  await store.dispatch(actionCreators.getPost(id));

  expect(mock.history.get[0].url).toBe(`/api/posts/${id}`);
});

it('should dispatch action POST_LOADING', async () => {
  const expectedAction = { type: POST_LOADING };
  await store.dispatch(actionCreators.getPost(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('should dispatch action GET_POST', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_POST };
  await store.dispatch(actionCreators.getPost(id));

  expect(store.getActions()[1]).toEqual(expectedAction);
});

it('should dispatch action GET_POST if error is happened', async () => {
  const expectedAction = { type: GET_POST, payload: null };
  mock.onGet(`/api/posts/${id}`).reply(404);
  await store.dispatch(actionCreators.getPost(id));

  expect(store.getActions()[1]).toEqual(expectedAction);
});
