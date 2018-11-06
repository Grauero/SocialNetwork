import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING } from '../types';

// Profile loading
export const setProfileLoading = () => ({
  type: PROFILE_LOADING
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
