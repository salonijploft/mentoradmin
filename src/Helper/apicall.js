import axios from 'axios';
import axiosInstance from './axiosInstance';

export const API_BASE_URL = `https://jpd3d1gr-8081.inc1.devtunnels.ms`
// `https://jpd3d1gr-8081.inc1.devtunnels.ms`
// `https://v7.checkprojectstatus.com:8080`
// `https://jpd3d1gr-8080.inc1.devtunnels.ms`
// `https://jpd3d1gr-8080.inc1.devtunnels.ms`
//   `https://g70bg47x-3010.inc1.devtunnels.ms`

//  `https://g70bg47x-3010.inc1.devtunnels.ms` 
// `https://v7.checkprojectstatus.com:8080`
//  export const API_BASE_URL = `https://g70bg47x-3010.inc1.devtunnels.ms`
// `https://g70bg47x-3010.inc1.devtunnels.ms`
// `http://3.108.129.119:8080`

const apiCall = async (method, endpoint, data = null, params = null) => {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
        params,
      });
      console.log('resolve11', response);
      return response.data;
    } catch (error) {
      console.error('API Call Error:', error.message);
      throw error;
    }
  };

export default apiCall;


  
 