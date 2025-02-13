import React, { createContext, useState, useCallback, useEffect, useRef } from "react";
import { useSpinner } from "../wrappers/GlobalSpinner";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { setIsLoading } = useSpinner();
  
  const authCheckRef = useRef(false);
  const refreshingRef = useRef(false);
  const refreshPromiseRef = useRef(null);
  const tabId = useRef(`tab-${Math.random().toString(36).substr(2, 9)}`);
  const masterTabRef = useRef(false);
  const authChannelRef = useRef(null);
  axios.defaults.withCredentials = true;
  // Initialize BroadcastChannel
  useEffect(() => {
    authChannelRef.current = new BroadcastChannel('auth_channel');
    
    const handleAuthMessage = (event) => {
      const { type, payload, sender } = event.data;
      
      if (sender === tabId.current) return; // Ignore own messages
      
      switch (type) {
        case 'TOKEN_REFRESHED':
          setAccessToken(payload.accessToken);
          const decodedToken = jwtDecode(payload.accessToken);
          setAuth(true);
          setUser({
            login_id: decodedToken.login_id,
            firstLogin: decodedToken.first_login,
            accountType: decodedToken.accountType
          });
          break;
          
        case 'LOGOUT':
          setAuth(false);
          setUser(null);
          setAccessToken(null);
          break;
          
        case 'MASTER_CHECK':
          if (masterTabRef.current) {
            authChannelRef.current?.postMessage({
              type: 'MASTER_RESPONSE',
              sender: tabId.current
            });
          }
          break;
          
        case 'MASTER_RESPONSE':
          masterTabRef.current = false;
          break;
      }
    };

    authChannelRef.current.addEventListener('message', handleAuthMessage);
    
    // Check if this is the master tab
    masterTabRef.current = true;
    authChannelRef.current.postMessage({
      type: 'MASTER_CHECK',
      sender: tabId.current
    });
    
    // Cleanup function
    return () => {
      if (authChannelRef.current) {
        authChannelRef.current.removeEventListener('message', handleAuthMessage);
        authChannelRef.current.close();
        authChannelRef.current = null;
      }
    };
  }, []);

  const refreshToken = useCallback(async () => {
    // Only master tab should refresh tokens
    if (!masterTabRef.current) return true;
    
    if (auth || accessToken) return true;
    
    if (refreshingRef.current) {
      return refreshPromiseRef.current;
    }


    refreshingRef.current = true;
    refreshPromiseRef.current = new Promise(async (resolve) => {
      setIsLoading(true);
      try {
        const response = await axios.post(import.meta.env.VITE_REFRESH_URL);
        if (response.status === 200) {
          const newToken = response.data.data.accessToken;
          setAccessToken(newToken);
          const decodedToken = jwtDecode(newToken);
          setAuth(true);
          setUser({
            login_id: decodedToken.login_id
          });
          
          // Broadcast the new token to other tabs
          authChannelRef.current?.postMessage({
            type: 'TOKEN_REFRESHED',
            payload: { accessToken: newToken },
            sender: tabId.current
          });
          
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        resolve(false);
      } finally {
        setIsLoading(false);
        refreshingRef.current = false;
        refreshPromiseRef.current = null;
      }
    });

    return refreshPromiseRef.current;
  }, [auth, accessToken, setIsLoading]);


  const logout = useCallback(async () => {
    if (!accessToken) {
      alert('No access token found');
      return;
    }
  
    try {
      const decodedToken = jwtDecode(accessToken);
      const login_id = decodedToken.login_id;
  
      const response = await axios.post(`http://localhost:3000/logout`, {
        login_id: login_id // Use decoded login_id from accessToken
      });
  
      if (response.status === 204) {
        alert(`Logged out Successfully`);
        setAuth(false);
        setUser(null);
        setAccessToken(null);
        
        // Broadcast logout to other tabs
        authChannelRef.current?.postMessage({
          type: 'LOGOUT',
          sender: tabId.current
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert(`Session expired. Please login again`);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, setIsLoading]); // Add accessToken to dependencies

  console.log(user)

  const userInfo = useCallback((token) => {
    const decodedToken = jwtDecode(token);
    setAuth(true);
    setUser({ login_id: decodedToken.login_id });
    setAccessToken(token);
  }, []);

  // Add initial auth check effect
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authCheckRef.current || auth) return;
      authCheckRef.current = true;
    
      setIsLoading(true);
    
      if (!accessToken) {
        const refreshSuccess = await refreshToken();
        }
      setIsAuthChecked(true);
      setIsLoading(false);
    };
  
    checkAuthStatus();
  }, [accessToken, refreshToken, auth, setIsLoading]);

  // Add token refresh interval effect
  useEffect(() => {
    let refreshInterval;
    if (auth && masterTabRef.current) {
      refreshInterval = setInterval(async () => {
        const refreshSuccess = await refreshToken();
        }, 14 * 60 * 1000); // Refresh every 14 minutes
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [auth, refreshToken ]);

  const value = {
    auth,
    setAuth,
    user,
    setAccessToken,
    refreshToken,
    accessToken,
    userInfo,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;