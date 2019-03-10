import * as actionCreators from '../../../../src/store/actions/postActions';
import { GET_ERRORS, DELETE_POST } from '../../../../src/store/types';
import { mock, store, id } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onDelete(`/api/posts/${id}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('makes DELETE request to /api/posts/id', async () => {
  await store.dispatch(actionCreators.deletePost(id));

  expect(mock.history.delete[0].url).toBe(`/api/posts/${id}`);
});

it('dispatches action DELETE_POST', async () => {
  const expectedAction = { payload: id, type: DELETE_POST };
  await store.dispatch(actionCreators.deletePost(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('dispatches action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onDelete(`/api/posts/${id}`).reply(404);
  await store.dispatch(actionCreators.deletePost(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
