import * as actionCreators from '../../../../src/store/actions/postActions';
import { POST_LOADING, GET_ERRORS } from '../../../../src/store/types';
import { mock, store, id } from '../../../../mocks/testConfig';

beforeEach(() => {
  mock.onPost(`/api/posts/unlike/${id}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  });
});
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('makes POST request to /api/posts/unlike/id', async () => {
  await store.dispatch(actionCreators.removeLike(id));

  expect(mock.history.post[0].url).toBe(`/api/posts/unlike/${id}`);
});

it('dispatches action POST_LOADING', async () => {
  const expectedAction = { type: POST_LOADING };
  await store.dispatch(actionCreators.removeLike(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('dispatches action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onPost(`/api/posts/unlike/${id}`).reply(404);
  await store.dispatch(actionCreators.removeLike(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
