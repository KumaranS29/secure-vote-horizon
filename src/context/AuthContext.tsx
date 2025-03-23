
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// User roles
export enum UserRole {
  Voter = "voter",
  Candidate = "candidate",
  Admin = "admin",
  StateOfficial = "state_official",
  OverseasVoter = "overseas_voter"
}

// Auth User interface
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  state?: string;
  verified: boolean;
  aadhaarVerified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  passportVerified?: boolean;
  faceVerified?: boolean;
  partyId?: string;
}

// Auth context interface
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<AuthUser>, password: string) => Promise<boolean>;
  verifyOTP: (otp: string, type: "email" | "phone") => Promise<boolean>;
  updateUser: (data: Partial<AuthUser>) => void;
  sendOTP: (type: "email" | "phone") => Promise<boolean>;
  verifyAadhaar: (aadhaarId: string) => Promise<boolean>;
  verifyPassport: (passportId: string) => Promise<boolean>;
  verifyFace: () => Promise<boolean>;
}

// Creating the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  verifyOTP: async () => false,
  updateUser: () => {},
  sendOTP: async () => false,
  verifyAadhaar: async () => false,
  verifyPassport: async () => false,
  verifyFace: async () => false
});

// Mock database of users for demo purposes
const mockUsers: Record<string, { user: AuthUser; password: string }> = {
  "admin@evoting.gov": {
    user: {
      id: "admin-1",
      name: "Admin User",
      email: "admin@evoting.gov",
      role: UserRole.Admin,
      verified: true,
      emailVerified: true,
      phoneVerified: true
    },
    password: "admin123"
  }
};

// Mock verification database
const mockVerifications = {
  aadhaar: ["123456789012", "987654321098"],
  passport: ["A1234567", "B7654321"],
  partyIds: ["BJP001", "INC002", "AAP003"]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check for user in local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in our mock database
    const userRecord = mockUsers[email.toLowerCase()];
    
    if (userRecord && userRecord.password === password && userRecord.user.role === role) {
      setUser(userRecord.user);
      localStorage.setItem("auth_user", JSON.stringify(userRecord.user));
      toast.success("Login successful");
      setIsLoading(false);
      return true;
    }
    
    toast.error("Invalid credentials");
    setIsLoading(false);
    return false;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    toast.info("You have been logged out");
  };
  
  // Register function
  const register = async (userData: Partial<AuthUser>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email already exists
    if (mockUsers[userData.email?.toLowerCase() || ""]) {
      toast.error("Email already registered");
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUserId = `user-${Date.now()}`;
    const newUser: AuthUser = {
      id: newUserId,
      name: userData.name || "User",
      email: userData.email || "",
      phone: userData.phone,
      role: userData.role || UserRole.Voter,
      state: userData.state,
      verified: false,
      aadhaarVerified: false,
      emailVerified: false,
      phoneVerified: false,
      passportVerified: false,
      faceVerified: false,
      partyId: userData.partyId
    };
    
    // Add to mock database
    mockUsers[newUser.email.toLowerCase()] = {
      user: newUser,
      password
    };
    
    toast.success("Registration successful. Please verify your details.");
    setIsLoading(false);
    return true;
  };
  
  // OTP verification function
  const verifyOTP = async (otp: string, type: "email" | "phone"): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any 6-digit OTP
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      const updatedUser = { ...user };
      
      if (type === "email") {
        updatedUser.emailVerified = true;
      } else if (type === "phone") {
        updatedUser.phoneVerified = true;
      }
      
      // Check if all required verifications are done
      if (
        (updatedUser.role === UserRole.Voter && 
         updatedUser.emailVerified && 
         updatedUser.phoneVerified && 
         updatedUser.aadhaarVerified) ||
        (updatedUser.role === UserRole.OverseasVoter && 
         updatedUser.emailVerified && 
         updatedUser.phoneVerified && 
         updatedUser.passportVerified) ||
        (updatedUser.role === UserRole.Candidate && 
         updatedUser.emailVerified && 
         updatedUser.phoneVerified && 
         updatedUser.aadhaarVerified &&
         updatedUser.partyId) ||
        (updatedUser.role === UserRole.StateOfficial && 
         updatedUser.emailVerified && 
         updatedUser.phoneVerified && 
         updatedUser.aadhaarVerified)
      ) {
        updatedUser.verified = true;
      }
      
      setUser(updatedUser);
      
      // Update in mock database and local storage
      if (mockUsers[user.email.toLowerCase()]) {
        mockUsers[user.email.toLowerCase()].user = updatedUser;
      }
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      
      toast.success(`${type === "email" ? "Email" : "Phone"} verified successfully`);
      setIsLoading(false);
      return true;
    }
    
    toast.error("Invalid OTP");
    setIsLoading(false);
    return false;
  };
  
  // Update user function
  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    // Update in mock database and local storage
    if (mockUsers[user.email.toLowerCase()]) {
      mockUsers[user.email.toLowerCase()].user = updatedUser;
    }
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  };
  
  // Send OTP function
  const sendOTP = async (type: "email" | "phone"): Promise<boolean> => {
    if (!user) return false;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`OTP sent to your ${type === "email" ? "email" : "phone"}. For demo, use any 6-digit number.`);
    return true;
  };
  
  // Verify Aadhaar
  const verifyAadhaar = async (aadhaarId: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if Aadhaar ID exists in our mock database
    if (mockVerifications.aadhaar.includes(aadhaarId) || aadhaarId === "123456789012") {
      const updatedUser = { ...user, aadhaarVerified: true };
      
      // Check if all required verifications are done
      if (updatedUser.emailVerified && updatedUser.phoneVerified) {
        updatedUser.verified = true;
      }
      
      setUser(updatedUser);
      
      // Update in mock database and local storage
      if (mockUsers[user.email.toLowerCase()]) {
        mockUsers[user.email.toLowerCase()].user = updatedUser;
      }
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      
      toast.success("Aadhaar verified successfully");
      setIsLoading(false);
      return true;
    }
    
    toast.error("Invalid Aadhaar ID");
    setIsLoading(false);
    return false;
  };
  
  // Verify Passport
  const verifyPassport = async (passportId: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if Passport ID exists in our mock database
    if (mockVerifications.passport.includes(passportId) || passportId === "A1234567") {
      const updatedUser = { ...user, passportVerified: true };
      
      // Check if all required verifications are done
      if (updatedUser.emailVerified && updatedUser.phoneVerified) {
        updatedUser.verified = true;
      }
      
      setUser(updatedUser);
      
      // Update in mock database and local storage
      if (mockUsers[user.email.toLowerCase()]) {
        mockUsers[user.email.toLowerCase()].user = updatedUser;
      }
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      
      toast.success("Passport verified successfully");
      setIsLoading(false);
      return true;
    }
    
    toast.error("Invalid Passport ID");
    setIsLoading(false);
    return false;
  };
  
  // Verify Face
  const verifyFace = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, always succeed
    const updatedUser = { ...user, faceVerified: true };
    setUser(updatedUser);
    
    // Update in mock database and local storage
    if (mockUsers[user.email.toLowerCase()]) {
      mockUsers[user.email.toLowerCase()].user = updatedUser;
    }
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    
    toast.success("Face verification successful");
    setIsLoading(false);
    return true;
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading,
        login,
        logout,
        register,
        verifyOTP,
        updateUser,
        sendOTP,
        verifyAadhaar,
        verifyPassport,
        verifyFace
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
