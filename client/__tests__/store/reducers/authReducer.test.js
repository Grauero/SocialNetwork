import { SET_CURRENT_USER } from '../../../src/store/types';
import authReducer from '../../../src/store/reducers/authReducer';

const initialState = {
  isAuthenticated: false,
  user: {}
};

it('should return initial state if fails to proceed action', () => {
  const res = authReducer(initialState, 'UNKNOWN_ACTION');

  expect(res).toEqual(initialState);
});

describe('SET_CURRENT_USER', () => {
  const action = {
    type: SET_CURRENT_USER,
    payload: 'payload'
  };

  it('should toggle isAuthenticated field if ACTION.PAYLOAD is NOT empty', () => {
    const res = authReducer(initialState, action);

    expect(res.isAuthenticated).not.toBe(initialState.isAuthenticated);
  });

  it('should NOT toggle isAuthenticated field if ACTION.PAYLOAD is empty', () => {
    const res = authReducer(initialState, { type: SET_CURRENT_USER });

    expect(res.isAuthenticated).toBe(initialState.isAuthenticated);
  });

  it('should return updated user field', () => {
    const res = authReducer(initialState, action);

    expect(res.user).toBe('payload');
  });
});