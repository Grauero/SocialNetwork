import axios from 'axios';

import { GET_ERRORS } from '../types';

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
