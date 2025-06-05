import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Import user types from shared/types or define them here
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatarUrl: string;
}

// Auth context interface
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// Mock users for demo - in a real app, these would come from an API
// This would be migrated from your mockData.ts
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "2",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and makes auth object available
 * Migrated from the original AuthContext.tsx
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would make an API call
  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user = mockUsers.find((u) => u.email === email);
    if (user && password === "password") {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      throw new Error("Invalid email or password");
    }
  };

  // Mock register function - in a real app, this would make an API call
  const register = async (name: string, email: string, _password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      throw new Error("User with this email already exists");
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    };
    
    // In a real app, we would add the user to the database here
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook for accessing the auth context
 */
export function useAuth() {
  return useContext(AuthContext);
}