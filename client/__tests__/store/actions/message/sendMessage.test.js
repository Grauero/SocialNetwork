import * as actionCreators from '../../../../src/store/actions/profileActions';
import { GET_ERRORS } from '../../../../src/store/types';
import { mock, store, history } from '../../../../mocks/testConfig';

beforeEach(() =>
  mock.onPost('/api/profile/message').reply(function() {
    return new Promise((resolve, reject) => resolve([200, { test: 'test' }]));
  })
);
afterEach(() => {
  mock.reset();
  store.clearActions();
});
const testObj = { from: 'from', to: 'to', title: 'title', message: 'message' };

it('makes POST request to /api/profile/message', async () => {
  await store.dispatch(actionCreators.sendMessage(testObj, history));

  expect(mock.history.post[0].data).toContain('from');
  expect(mock.history.post[0].data).toContain('to');
  expect(mock.history.post[0].data).toContain('title');
  expect(mock.history.post[0].data).toContain('message');
});

it('updates history object with /dashobard record', async () => {
  const res = await store.dispatch(
    actionCreators.sendMessage(testObj, history)
  );

  expect(res).toBe('/dashboard');
  expect(history.push).toBeCalledWith('/dashboard');
});

it('dispatches action GET_ERRORS if error is happened', async () => {
  const expectedAction = { payload: undefined, type: GET_ERRORS };
  mock.onPost('/api/profile/message').reply(404);
  await store.dispatch(actionCreators.addEducation(testObj, history));

  expect(store.getActions()[0]).toEqual(expectedAction);
});
