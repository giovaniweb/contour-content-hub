
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language: "PT" | "EN" | "ES";
  profilePhotoUrl?: string;
  passwordChanged: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, "id" | "passwordChanged"> & { password: string }) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("reelline-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock login for prototype - in real app, this would be an API call
      if (email && password === "ReelLine@123") {
        // First time login with default password
        const mockUser: User = {
          id: "user-1",
          name: "Demo User",
          email,
          language: "EN",
          passwordChanged: false
        };
        setUser(mockUser);
        localStorage.setItem("reelline-user", JSON.stringify(mockUser));
        toast({
          title: "Login successful",
          description: "Please change your password for security reasons.",
        });
        navigate("/dashboard");
      } else if (email && password) {
        // Regular login (mock)
        const mockUser: User = {
          id: "user-1",
          name: "Demo User",
          email,
          clinic: "Beauty Clinic",
          city: "São Paulo",
          phone: "+5511999999999",
          equipment: ["UltraSonic", "Venus Freeze"],
          language: "EN",
          profilePhotoUrl: "/placeholder.svg",
          passwordChanged: true
        };
        setUser(mockUser);
        localStorage.setItem("reelline-user", JSON.stringify(mockUser));
        toast({
          title: "Login successful",
          description: "Welcome to ReelLine!",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Something went wrong",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, "id" | "passwordChanged"> & { password: string }) => {
    try {
      setIsLoading(true);
      // Mock registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...userData,
        passwordChanged: userData.password !== "ReelLine@123"
      };
      
      delete (newUser as any).password;
      
      setUser(newUser);
      localStorage.setItem("reelline-user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: "Welcome to ReelLine!",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Something went wrong",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Mock password update
      if (currentPassword === "ReelLine@123") {
        if (user) {
          const updatedUser = { ...user, passwordChanged: true };
          setUser(updatedUser);
          localStorage.setItem("reelline-user", JSON.stringify(updatedUser));
          
          toast({
            title: "Password updated",
            description: "Your password has been successfully changed",
          });
          return true;
        }
      } else {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "Current password is incorrect",
        });
      }
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: "Something went wrong",
      });
      console.error(error);
      return false;
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("reelline-user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("reelline-user");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateUser,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
