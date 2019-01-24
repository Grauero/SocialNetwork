import * as actionCreators from '../../../src/store/actions/authActions';
import { SET_CURRENT_USER } from '../../../src/store/types';

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
