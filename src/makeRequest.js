import axios from 'axios';

export const makeRequest = (type) => {
  if (localStorage.getItem('token') === null) {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }

  if (type === 'auth') {
    return axios.create({
      baseURL: process.env.REACT_APP_UPLOAD_URL,
      headers: {
        Authorization: 'bearer ' + localStorage.getItem('token'),
      },
    });
  }

  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: 'bearer ' + localStorage.getItem('token'),
    },
  });
};
