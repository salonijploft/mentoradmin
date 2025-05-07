import React, { createContext, useContext, useEffect, useState } from 'react';
import { axiosSecure } from '../utils/axiosSecureInstance.js';
import config from '../config/config.js';
import useTokenRefreshOnLoad from '../hooks/useTokenRefreshOnLoad.ts';
import useTokenAutoRefresh from '../hooks/useTokenAutoRefresh.ts';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingData, setLoading] = useState(true);

  useTokenRefreshOnLoad();
  useTokenAutoRefresh();

  const fetchUser  = async () => {
    try {
      const res = await axiosSecure.get(`${config.API_BASE_URL}/auth/me`, { withCredentials: true });
      setUser(res.data.user);
      console.log("fetchUser function: User fetched successfully", res.data.user); // Log the fetched user
    } catch (error) {
      console.error("fetchUser function: Error fetching user", error); // Log the error
      setUser (null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingData, isAuthenticated: !!user, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
