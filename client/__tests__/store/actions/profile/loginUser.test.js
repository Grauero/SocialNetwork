import * as actionCreators from '../../../../src/store/actions/authActions';
import { SET_CURRENT_USER, GET_ERRORS } from '../../../../src/store/types';
import { mock, store, token, userData } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost('/api/users/login').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { token }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make POST request to /api/users/login', async () => {
  await store.dispatch(actionCreators.loginUser(userData));

  expect(mock.history.post[0].data).toBe(userData);
});

it('should save token into localStorage', async () => {
  await store.dispatch(actionCreators.loginUser(userData));
  const item = window.localStorage.getItem('jwtToken');

  expect(item).toBe(token);
});

it('should dispatch SET_CURRENT_USER action', async () => {
  const expectedAction = { type: SET_CURRENT_USER };
  await store.dispatch(actionCreators.loginUser(userData));

  expect(store.getActions()[0].type).toBe(expectedAction.type);
});

it('should dispatch action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onPost(`/api/users/login`).reply(404);
  await store.dispatch(actionCreators.loginUser(userData));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
