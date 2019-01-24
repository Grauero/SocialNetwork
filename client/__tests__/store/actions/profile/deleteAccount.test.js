import * as actionCreators from '../../../../src/store/actions/profileActions';
import { SET_CURRENT_USER, GET_ERRORS } from '../../../../src/store/types';
import { mock, store } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onDelete('/api/profile').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should NOT dispatch any action if user declined', async () => {
  window.confirm = jest.fn(() => false);
  await store.dispatch(actionCreators.deleteAccount());

  expect(mock.history.delete.length).toBe(0);
  expect(store.getActions().length).toBe(0);
});

it('should make DELETE request to /api/profile', async () => {
  window.confirm = jest.fn(() => true);
  await store.dispatch(actionCreators.deleteAccount());

  expect(mock.history.delete[0].url).toBe('/api/profile');
});

it('should dispatch action SET_CURRENT_USER', async () => {
  window.confirm = jest.fn(() => true);
  const expectedAction = { payload: {}, type: SET_CURRENT_USER };
  await store.dispatch(actionCreators.deleteAccount());

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('should dispatch action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onDelete('/api/profile').reply(404);
  await store.dispatch(actionCreators.deleteAccount());

  expect(store.getActions()[0]).toEqual(expectedAction);
});
