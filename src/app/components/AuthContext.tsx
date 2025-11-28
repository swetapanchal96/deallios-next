"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  customerGUID: string | null;
  authToken: string | null;
  login: (guid: string, token: string) => void;
  logout: () => void;
}

export const CustomAuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  customerGUID: null,
  authToken: null,
  login: () => {},
  logout: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const CustomAuthProvider = ({ children }: ProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerGUID, setCustomerGUID] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const storedGUID = localStorage.getItem("Customer_GUID");
    const storedToken = localStorage.getItem("token");

    if (storedGUID && storedToken) {
      setIsLoggedIn(true);
      setCustomerGUID(storedGUID);
      setAuthToken(storedToken);
    }
  }, []);

  const login = (guid: string, token: string) => {
    localStorage.setItem("Customer_GUID", guid);
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setCustomerGUID(guid);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("Customer_GUID");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCustomerGUID(null);
    setAuthToken(null);
  };

  return (
    <CustomAuthContext.Provider value={{ isLoggedIn, customerGUID, authToken, login, logout }}>
      {children}
    </CustomAuthContext.Provider>
  );
};
