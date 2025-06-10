import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  progress: {
    completedCourses: string[];
    completedLessons: string[];
    level: number;
    points: number;
    streak: number;
  };
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password?: string, isAdmin?: boolean) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  loginAsUser: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  updateUserProgress: (progress: User['progress']) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users
const mockUsers = {
  user: {
    id: "user1",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    progress: {
      completedCourses: ["intro-to-html"],
      completedLessons: ["html-basics", "html-forms", "css-intro"],
      level: 3,
      points: 345,
      streak: 5
    }
  },
  admin: {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    progress: {
      completedCourses: [],
      completedLessons: [],
      level: 0,
      points: 0,
      streak: 0
    }
  }
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (_email: string, _password?: string, isAdmin: boolean = false) => {
    setLoading(true);
    if (_password) console.log(_password); // To satisfy ESLint about unused _password
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just check if email contains 'admin'
      const user = isAdmin ? mockUsers.admin : mockUsers.user;
      
      // Store user in localStorage and context
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user as User);
      toast.success(`Logged in as ${user.name}`);
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick login as user function
  const loginAsUser = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Store user in localStorage and context
      localStorage.setItem("currentUser", JSON.stringify(mockUsers.user));
      setCurrentUser(mockUsers.user as User);
      toast.success(`Logged in as ${mockUsers.user.name}`);
    } catch (error) {
      console.error(error);
      toast.error("Quick login failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick login as admin function
  const loginAsAdmin = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Store admin in localStorage and context
      localStorage.setItem("currentUser", JSON.stringify(mockUsers.admin));
      setCurrentUser(mockUsers.admin as User);
      toast.success(`Logged in as ${mockUsers.admin.name}`);
    } catch (error) {
      console.error(error);
      toast.error("Quick login failed");
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, _password?: string) => {
    setLoading(true);
    if (_password) console.log(_password); // To satisfy ESLint about unused _password
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create a new user (in a real app, this would be done on the server)
      const newUser: User = {
        id: `user${Date.now()}`,
        name,
        email,
        role: "user",
        avatar: undefined, // No avatar for new users
        progress: {
          completedCourses: [],
          completedLessons: [],
          level: 1,
          points: 0,
          streak: 0
        }
      };
      
      // Store user in localStorage and context
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setCurrentUser(newUser);
      toast.success("Account created successfully");
    } catch (error) {
      console.error(error);
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast.success("Logged out successfully");
  };

  // Update user progress
  const updateUserProgress = async (progress: User['progress']) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      progress
    };
    
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    loginAsUser,
    loginAsAdmin,
    updateUserProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};