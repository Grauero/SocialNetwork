import * as actionCreators from '../src/store/actions/authActions';
import { GET_ERRORS, SET_CURRENT_USER } from '../src/store/types';

describe('sync auth action creators', () => {
  describe('setCurrentUser', () => {
    it('should create an action SET_CURRENT_USER', () => {
      const payload = { test: 'test' };
      const expectedAction = {
        type: SET_CURRENT_USER,
        payload
      };

      expect(actionCreators.setCurrentUser(payload)).toEqual(expectedAction);
    });
  });

  describe('logoutUser', () => {
    it('should clear local storage', () => {
      actionCreators.logoutUser();

      expect(window.localStorage.removeItem).toBeCalled();
    });
  });
});
