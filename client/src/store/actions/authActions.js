import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from '../types';
import setAuthToken from '../utils/setAuthToken';

// register user
export const registerUser = (userData, history) => (dispatch) => {
  axios.post('/api/users/register', userData)
    .then(() => history.push('/login'))
    .catch(err => dispatch(
      {
        type: GET_ERRORS,
        payload: err.response.data
      }
    ));
};

// set loged in user
export const setCurrentUser = decodedInfo => ({
  type: SET_CURRENT_USER,
  payload: decodedInfo
});

// login user
export const loginUser = userData => (dispatch) => {
  axios.post('/api/users/login', userData)
    .then((res) => {
      const { token } = res.data;

      localStorage.setItem('jwtToken', token);
      // set JWT-token for API requests
      setAuthToken(token);
      // decode token info
      const decodedInfo = jwt_decode(token);

      dispatch(setCurrentUser(decodedInfo));
    })
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }
    ));
};

// logout user
export const logoutUser = () => (dispatch) => {
  // clear local storage
  localStorage.removeItem('jwtToken');
  // remove auth headers from requests
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
