import { TEST_DISPATCH } from '../types';

// register user
export const registerUser = userData => ({
  type: TEST_DISPATCH,
  payload: userData
});
