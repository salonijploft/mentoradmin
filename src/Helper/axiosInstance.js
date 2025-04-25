// src/api/axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://v7.checkprojectstatus.com:8080',
      //  export const API_BASE_URL = `https://g70bg47x-3010.inc1.devtunnels.ms`
     // `https://g70bg47x-3010.inc1.devtunnels.ms`
     //`http://3.108.129.119:8080`
  withCredentials: true, // Ensures cookies are sent with requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
