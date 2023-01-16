import axios from 'axios';

export const makeRequest = (type) => {
  if (localStorage.getItem('token') === null) {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }

  if (type === 'noAuth') {
    return axios.create({
      baseURL: process.env.REACT_APP_UPLOAD_URL,
    });
  }

  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: 'bearer ' + localStorage.getItem('token'),
    },
  });
};
