import * as actionCreators from '../../../../src/store/actions/postActions';
import {
  GET_POST,
  GET_ERRORS,
  CLEAR_ERRORS
} from '../../../../src/store/types';
import { mock, store, id } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost(`/api/posts/comment/${id}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('makes POST request to /api/posts/comment/id', async () => {
  await store.dispatch(actionCreators.addComment(id));

  expect(mock.history.post[0].url).toBe(`/api/posts/comment/${id}`);
});

it('dispatches action CLEAR_ERRORS', async () => {
  const expectedAction = { type: CLEAR_ERRORS };
  await store.dispatch(actionCreators.addComment(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('dispatches action GET_POST', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_POST };
  await store.dispatch(actionCreators.addComment(id));

  expect(store.getActions()[1]).toEqual(expectedAction);
});

it('dispatches action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onPost(`/api/posts/comment/${id}`).reply(404);
  await store.dispatch(actionCreators.addComment(id));

  expect(store.getActions()[1]).toEqual(expectedAction);
});
