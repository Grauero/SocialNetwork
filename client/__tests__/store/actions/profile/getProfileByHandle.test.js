import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_PROFILE, PROFILE_LOADING } from '../../../../src/store/types';
import { mock, store, handle } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onGet(`/api/profile/handle/${handle}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should dispatch action PROFILE_LOADING', async () => {
  const expectedAction = { type: PROFILE_LOADING };
  await store.dispatch(actionCreators.getProfileByHandle(handle));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('should make GET request to /api/profile/handle/handle', async () => {
  await store.dispatch(actionCreators.getProfileByHandle(handle));

  expect(mock.history.get[0].url).toBe(`/api/profile/handle/${handle}`);
});

it('should dispatch action GET_PROFILE', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_PROFILE };
  await store.dispatch(actionCreators.getProfileByHandle(handle));

  expect(store.getActions()[1]).toEqual(expectedAction);
});

it('should dispatch action GET_PROFILE with no ACTION.PAYLOAD if error is happened', async () => {
  const expectedAction = { payload: null, type: GET_PROFILE };
  mock.onGet('/api/profile/handle/handle').reply(404);
  await store.dispatch(actionCreators.getProfileByHandle(handle));

  expect(store.getActions()[1]).toEqual(expectedAction);
});
