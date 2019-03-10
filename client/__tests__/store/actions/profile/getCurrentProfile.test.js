import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_PROFILE, PROFILE_LOADING } from '../../../../src/store/types';
import { mock, store } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onGet('/api/profile').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('dispatches action PROFILE_LOADING', async () => {
  const expectedAction = { type: PROFILE_LOADING };
  await store.dispatch(actionCreators.getCurrentProfile());

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('makes GET request to /api/profile', async () => {
  await store.dispatch(actionCreators.getCurrentProfile());

  expect(mock.history.get[0].url).toBe('/api/profile');
});

it('dispatches action GET_PROFILE', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_PROFILE };
  await store.dispatch(actionCreators.getCurrentProfile());

  expect(store.getActions()[1]).toEqual(expectedAction);
});

it('dispatches action GET_PROFILE with no ACTION.PAYLOAD if error is happened', async () => {
  const expectedAction = { payload: {}, type: GET_PROFILE };
  mock.onGet('/api/profile').reply(404);
  await store.dispatch(actionCreators.getCurrentProfile());

  expect(store.getActions()[1]).toEqual(expectedAction);
});
