import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_ERRORS, PROFILE_LOADING } from '../../../../src/store/types';
import { mock, store, id } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onDelete(`/api/profile/message/${id}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make DELETE request to /api/profile/message/id', async () => {
  await store.dispatch(actionCreators.deleteMessage(id));

  expect(mock.history.delete[0].url).toBe(`/api/profile/message/${id}`);
});

it('should dispatch action PROFILE_LOADING', async () => {
  const expectedAction = { type: PROFILE_LOADING };
  await store.dispatch(actionCreators.deleteMessage(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('should dispatch action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onDelete(`/api/profile/message/${id}`).reply(404);
  await store.dispatch(actionCreators.deleteMessage(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
