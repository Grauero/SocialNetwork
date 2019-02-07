import axios from 'axios';

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES
} from '../types';

// Delete account and profile
export const deleteAccount = () => async dispatch => {
  try {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      await axios.delete('/api/profile');

      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      });
    }
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Profile loading
export const setProfileLoading = () => ({
  type: PROFILE_LOADING
});

// Clear profile
export const clearCurrentProfile = () => ({
  type: CLEAR_CURRENT_PROFILE
});

// Create profile
export const createProfile = (profileData, history) => async dispatch => {
  try {
    await axios.post('/api/profile', profileData);
    return history.push('/dashboard');
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Get current profile
export const getCurrentProfile = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: {}
    });
  }
};

// Get profile by handle
export const getProfileByHandle = handle => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profile/handle/${handle}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: null
    });
  }
};

// Add experience
export const addExperience = (experienceData, history) => async dispatch => {
  try {
    await axios.post('/api/profile/experience', experienceData);
    return history.push('/dashboard');
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Add education
export const addEducation = (educationData, history) => async dispatch => {
  try {
    await axios.post('/api/profile/education', educationData);
    return history.push('/dashboard');
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Get all profiles
export const getProfiles = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profile/all');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILES,
      payload: null
    });
  }
};

export const sendMessage = (message, history) => async dispatch => {
  try {
    await axios.post('/api/profile/message', message);

    return history.push('/dashboard');
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const deleteMessage = id => async dispatch => {
  try {
    await axios.delete(`/api/profile/message/${id}`);

    dispatch(getCurrentProfile());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};
