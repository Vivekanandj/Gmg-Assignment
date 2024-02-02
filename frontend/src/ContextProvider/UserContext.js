import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('profileDataUser');
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);

        if (decodedToken) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error decoding JWT from localStorage:', error);
      setIsLoggedIn(false);
    }
  }, []);

  const login = (token) => {
    // Set token to localStorage
    localStorage.setItem("profileDataUser", token);
    
    // Set user data in state
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('profileDataUser'); // Remove the token from local storage
    setIsLoggedIn(false);
    updateImage('')
  };

  const updateImage = (url) => {
    setImageUrl(url);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, imageUrl, setImage: setImageUrl,updateImage  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
