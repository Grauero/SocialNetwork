import * as actionCreators from '../../../../src/store/actions/postActions';
import { GET_POST, GET_ERRORS } from '../../../../src/store/types';
import { mock, store, postId, commentId } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onDelete(`/api/posts/comment/${postId}/${commentId}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make DELETE request to /api/posts/comment/postId/commentId', async () => {
  await store.dispatch(actionCreators.deleteComment(postId, commentId));

  expect(mock.history.delete[0].url).toBe(
    `/api/posts/comment/${postId}/${commentId}`
  );
});

it('should dispatch action GET_POST', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_POST };
  await store.dispatch(actionCreators.deleteComment(postId, commentId));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('should dispatch action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onDelete(`/api/posts/comment/${postId}/${commentId}`).reply(404);
  await store.dispatch(actionCreators.deleteComment(postId, commentId));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
