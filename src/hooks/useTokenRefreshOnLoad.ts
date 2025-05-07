import { useEffect } from 'react';
import axios from 'axios';
import { axiosSecure } from '../utils/axiosSecureInstance';

const useTokenRefreshOnLoad = () => {
  useEffect(() => {
    const refreshToken = async () => {
      try {
        await axiosSecure.post('/auth/refresh-token', {
          withCredentials: true, // important for cookie auth
        });
        console.log('Token refreshed on page load');
      } catch (err) {
        console.error('Token refresh failed', err);
        // optionally: redirect to login or show logout modal
      }
    };

    refreshToken();
  }, []);
};

export default useTokenRefreshOnLoad;
