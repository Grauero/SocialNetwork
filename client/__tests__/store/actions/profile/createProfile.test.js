import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_ERRORS } from '../../../../src/store/types';
import { mock, store, profileData, history } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost('/api/profile').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('makes POST request to /api/profile', async () => {
  await store.dispatch(actionCreators.createProfile(profileData, history));

  expect(mock.history.post[0].data).toBe(profileData);
});

it('updates history object with /dashobard record', async () => {
  const res = await store.dispatch(
    actionCreators.createProfile(profileData, history)
  );

  expect(res).toBe('/dashboard');
  expect(history.push).toBeCalledWith('/dashboard');
});

it('dispatches action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onPost('/api/profile').reply(404);
  await store.dispatch(actionCreators.createProfile(profileData, history));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
