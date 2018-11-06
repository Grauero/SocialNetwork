import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from '../types';

// Profile loading
export const setProfileLoading = () => ({
  type: PROFILE_LOADING
});

// Clear profile
export const clearCurrentProfile = () => ({
  type: CLEAR_CURRENT_PROFILE
});

// Get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading);

  axios.get('/api/profile')
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(() => dispatch({
      type: GET_PROFILE,
      payload: {}
    }));
};
