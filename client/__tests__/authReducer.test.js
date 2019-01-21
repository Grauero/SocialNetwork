import { SET_CURRENT_USER } from '../src/store/types';
import authReducer from '../src/store/reducers/authReducer';
import errorsReducer from '../src/store/reducers/errorsReducer';

describe('auth reducer', () => {
  const initialState = {
    isAuthenticated: false,
    user: {}
  };

  it('should return initial state if fails to proceed action', () => {
    const res = authReducer(initialState, 'UNKNOWN_ACTION');

    expect(res).toEqual(initialState);
  });

  it('should return initial state if no action is provided', () => {
    const res = authReducer(initialState);

    expect(res).toEqual(initialState);
  });

  describe('SET_CURRENT_USER', () => {
    it('should toggle isAuthenticated field if payload is NOT empty', () => {
      const res = errorsReducer(initialState, {
        type: SET_CURRENT_USER,
        payload: 'payload'
      });

      expect(res.isAuthenticated).not.toBe(initialState.isAuthenticated);
    });

    it('should NOT toggle isAuthenticated field if payload IS empty', () => {
      const res = errorsReducer(initialState, { type: SET_CURRENT_USER });

      expect(res.isAuthenticated).toBe(initialState.isAuthenticated);
    });

    it('should return updated user field', () => {
      const res = errorsReducer(initialState, {
        type: SET_CURRENT_USER,
        payload: 'payload'
      });

      expect(res.user).toBe('payload');
    });
  });
});
