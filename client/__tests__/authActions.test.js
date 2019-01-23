import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import * as actionCreators from '../src/store/actions/authActions';
import { GET_ERRORS, SET_CURRENT_USER } from '../src/store/types';

const createMockStore = configureMockStore([thunk]);
const store = createMockStore({});

describe('sync auth action creators', () => {
  it('should create an action SET_CURRENT_USER', () => {
    const payload = { test: 'test' };
    const expectedAction = {
      type: SET_CURRENT_USER,
      payload
    };

    expect(actionCreators.setCurrentUser(payload)).toEqual(expectedAction);
  });

  describe('logoutUser', () => {
    it('should clear local storage', () => {
      window.localStorage.setItem('jwtToken', 'token');
      actionCreators.logoutUser()(() => ({}));

      expect(window.localStorage.getItem('jwtToken')).toBeNull();
    });

    it('should dispatch an action SET_CURRENT_USER', () => {
      const expectedAction = {
        type: SET_CURRENT_USER,
        payload: {}
      };
      const dispatch = jest.fn();
      actionCreators.logoutUser()(dispatch);

      expect(dispatch).toBeCalled();
      expect(dispatch).toBeCalledWith(expectedAction);
    });
  });
});

describe('async auth action creators', () => {
  const mock = new MockAdapter(axios);
  afterEach(() => store.clearActions());

  describe('registerUser', () => {
    const userData = 'userData';
    const history = { push: jest.fn(path => path) };

    beforeEach(() =>
      mock.onPost('/api/users/register').reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      })
    );
    afterEach(() => mock.reset());

    it('should make POST request to /api/users/register', async () => {
      await store.dispatch(actionCreators.registerUser(userData, history));

      expect(mock.history.post[0].data).toBe(userData);
    });

    it('should update history object with /login record', async () => {
      const res = await store.dispatch(
        actionCreators.registerUser(userData, history)
      );

      expect(res).toBe('/login');
      expect(history.push).toBeCalledWith('/login');
    });

    it('should dispatch an action GET_ERRORS if error happened', async () => {
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
  });
});
