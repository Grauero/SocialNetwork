import * as actionCreators from '../../../../src/store/actions/authActions';
import { GET_ERRORS } from '../../../../src/store/types';
import { mock, store, history, userData } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost('/api/users/register').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('makes POST request to /api/users/register', async () => {
  await store.dispatch(actionCreators.registerUser(userData, history));

  expect(mock.history.post[0].data).toBe(userData);
});

it('updates history object with /login record', async () => {
  const res = await store.dispatch(
    actionCreators.registerUser(userData, history)
  );

  expect(res).toBe('/login');
  expect(history.push).toBeCalledWith('/login');
});

it('dispatches an action GET_ERRORS if error happened', async () => {
  const expectedAction = { payload: 'error', type: GET_ERRORS };
  const history = {
    push: () => {
      /*eslint-disable*/
      throw { response: { data: 'error' } };
    }
  };

  await store.dispatch(actionCreators.registerUser(userData, history));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
