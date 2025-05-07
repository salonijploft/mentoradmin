import { useEffect } from 'react';
import axios from 'axios';
import { axiosSecure } from '../utils/axiosSecureInstance';

const useTokenAutoRefresh = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axiosSecure.get('/auth/refresh-token', {
          withCredentials: true,
        });
        console.log('Token auto-refreshed (55min interval)');
      } catch (err) {
        console.error('Auto token refresh failed', err);
      }
    }, 55 * 60 * 1000); 

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
};

export default useTokenAutoRefresh;
