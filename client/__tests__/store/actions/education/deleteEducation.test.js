import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_ERRORS, GET_PROFILE } from '../../../../src/store/types';
import { mock, store, id } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onDelete(`/api/profile/education/${id}`).reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});

it('makes DELETE request to /api/profile/education/id', async () => {
  await store.dispatch(actionCreators.deleteEducation(id));

  expect(mock.history.delete[0].url).toBe(`/api/profile/education/${id}`);
});

it('dispatches action GET_PROFILE', async () => {
  const expectedAction = { payload: { test: 'test' }, type: GET_PROFILE };
  await store.dispatch(actionCreators.deleteEducation(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});

it('dispatches action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onDelete(`/api/profile/education/${id}`).reply(404);
  await store.dispatch(actionCreators.deleteEducation(id));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
