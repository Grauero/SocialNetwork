import * as actionCreators from '../../../../src/store/actions/postActions';
import { ADD_POST, CLEAR_ERRORS, GET_POSTS } from '../../../../src/store/types';
import { mock, store, postData } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost('/api/posts').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make POST request to /api/posts', async () => {
  await store.dispatch(actionCreators.addPost(postData));

  expect(mock.history.post[0].data).toBe(postData);
});

it('should dispatch action CLEAR_ERRORS', async () => {
  const expectedAction = { type: CLEAR_ERRORS };
  await store.dispatch(actionCreators.addPost(postData));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('should dispatch action ADD_POST', async () => {
  const expectedAction = { payload: { test: 'test' }, type: ADD_POST };
  await store.dispatch(actionCreators.addPost(postData));

  expect(store.getActions()[1]).toEqual(expectedAction);
});

it('should dispatch action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: null, type: GET_POSTS };
  mock.onPost('/api/posts').reply(404);
  await store.dispatch(actionCreators.getPosts());

  expect(store.getActions()[1]).toEqual(expectedAction);
});
