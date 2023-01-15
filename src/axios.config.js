import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.revrentals.net',
});

export default axiosInstance;
