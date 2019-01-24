import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_ERRORS } from '../../../../src/store/types';
import { mock, store, history, experienceData } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost('/api/profile/experience').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make POST request to /api/profile/experience', async () => {
  await store.dispatch(actionCreators.addExperience(experienceData, history));

  expect(mock.history.post[0].data).toBe(experienceData);
});

it('should update history object with /dashobard record', async () => {
  const res = await store.dispatch(
    actionCreators.addExperience(experienceData, history)
  );

  expect(res).toBe('/dashboard');
  expect(history.push).toBeCalledWith('/dashboard');
});

it('should dispatch action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onPost('/api/profile/experience').reply(404);
  await store.dispatch(actionCreators.createProfile(experienceData, history));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
