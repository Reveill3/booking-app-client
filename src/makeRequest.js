import axios from 'axios';

export const makeRequest = (token) => {
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: 'bearer ' + token,
    },
  });
};
