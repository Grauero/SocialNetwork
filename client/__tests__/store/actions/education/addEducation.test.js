import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_ERRORS } from '../../../../src/store/types';
import { mock, store, educationData, history } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost('/api/profile/education').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('should make POST request to /api/profile/education', async () => {
  await store.dispatch(actionCreators.addEducation(educationData, history));

  expect(mock.history.post[0].data).toBe(educationData);
});

it('should update history object with /dashobard record', async () => {
  const res = await store.dispatch(
    actionCreators.addEducation(educationData, history)
  );

  expect(res).toBe('/dashboard');
  expect(history.push).toBeCalledWith('/dashboard');
});

it('should dispatch action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onPost('/api/profile/education').reply(404);
  await store.dispatch(actionCreators.addEducation(educationData, history));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
