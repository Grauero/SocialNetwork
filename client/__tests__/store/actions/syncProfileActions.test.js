import * as actionCreators from '../../../src/store/actions/profileActions';
import {
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from '../../../src/store/types';

it('creates an action PROFILE_LOADING', () => {
  const expectedAction = { type: PROFILE_LOADING };

  expect(actionCreators.setProfileLoading()).toEqual(expectedAction);
});

it('creates an action CLEAR_CURRENT_PROFILE', () => {
  const expectedAction = { type: CLEAR_CURRENT_PROFILE };

  expect(actionCreators.clearCurrentProfile()).toEqual(expectedAction);
});
