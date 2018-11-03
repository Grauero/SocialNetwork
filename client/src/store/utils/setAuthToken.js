import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    // send JWT-token with every API request
    axios.defaults.headers.common.Authorization = token;
  } else {
    // delete JWT-token from API requests
    delete axios.defaults.headers.common.Authorization;
  }
};

export default setAuthToken;
