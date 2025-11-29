import React, { createContext, useState, useContext, ReactNode } from "react";

// Types for TypeScript
interface User {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
}

interface AuthState {
  token: string | null;
  user: User;
}

interface LoginData {
  token: string;
  user: User;
}

interface AuthContextType {
  authState: AuthState;
  login: (data: LoginData) => void;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
}

// Create the AuthContext with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: typeof window !== "undefined" ? localStorage.getItem("authToken") || null : null,
    user: {
      first_name: typeof window !== "undefined" ? localStorage.getItem("first_name") || "" : "",
      last_name: typeof window !== "undefined" ? localStorage.getItem("last_name") || "" : "",
      email: typeof window !== "undefined" ? localStorage.getItem("email") || "" : "",
      mobile_number: typeof window !== "undefined" ? localStorage.getItem("mobile_number") || "" : "",
    },
  });

  // Function to log in and update auth state
  const login = ({ token, user }: LoginData): void => {
    setAuthState({ token, user });

    // Save data to localStorage (SSR safe)
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
      localStorage.setItem("first_name", user.first_name);
      localStorage.setItem("last_name", user.last_name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("mobile_number", user.mobile_number);
    }
  };

  // Function to log out
  const logout = (): void => {
    setAuthState({ token: null, user: { first_name: "", last_name: "", email: "", mobile_number: "" } });

    // Clear localStorage (SSR safe)
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("email");
      localStorage.removeItem("mobile_number");
    }
  };

  // Function to update user profile
  const updateProfile = (updatedUser: Partial<User>): void => {
    setAuthState((prevState) => {
      const newUser: User = { ...prevState.user, ...updatedUser };
      
      // Save updated data to localStorage (SSR safe)
      if (typeof window !== "undefined") {
        localStorage.setItem("first_name", newUser.first_name);
        localStorage.setItem("last_name", newUser.last_name);
        localStorage.setItem("email", newUser.email);
        localStorage.setItem("mobile_number", newUser.mobile_number);
      }

      return {
        ...prevState,
        user: newUser,
      };
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext with type safety
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
