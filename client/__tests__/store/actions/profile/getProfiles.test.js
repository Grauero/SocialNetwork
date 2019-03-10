import * as actionCreators from '../../../../src/store/actions/profileActions';
import { PROFILE_LOADING, GET_PROFILES } from '../../../../src/store/types';
import { mock, store } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onGet('/api/profile/all').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('dispatches action PROFILE_LOADING', async () => {
  const expectedAction = { type: PROFILE_LOADING };
  await store.dispatch(actionCreators.getProfiles());

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('makes GET request to /api/profile/all', async () => {
  await store.dispatch(actionCreators.getProfiles());

  expect(mock.history.get[0].url).toBe('/api/profile/all');
});

it('dispatches action GET_PROFILES', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_PROFILES };
  await store.dispatch(actionCreators.getProfiles());

  expect(store.getActions()[1]).toEqual(expectedAction);
});

it('dispatches action GET_PROFILES with no ACTION.PAYLOAD if error is happened', async () => {
  const expectedAction = { payload: null, type: GET_PROFILES };
  mock.onGet('/api/profile/all').reply(404);
  await store.dispatch(actionCreators.getProfiles());

  expect(store.getActions()[1]).toEqual(expectedAction);
});
