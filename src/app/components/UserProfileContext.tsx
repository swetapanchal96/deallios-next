"use client";

import React, { createContext, useState, ReactNode } from "react";

interface UserProfileContextType {
  avatar: string;
  setAvatar: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

export const UserProfileContext = createContext<UserProfileContextType>({
  avatar: "",
  setAvatar: () => {},
  name: "",
  setName: () => {},
  email: "",
  setEmail: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const UserProfileProvider = ({ children }: ProviderProps) => {
  const [avatar, setAvatar] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  return (
    
    <UserProfileContext.Provider
      value={{ avatar, setAvatar, name, setName, email, setEmail }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
