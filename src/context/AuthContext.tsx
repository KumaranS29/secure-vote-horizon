
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

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
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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
  session: null,
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize the auth state from Supabase on component mount
  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Load user profile from the database
  const loadUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          role: data.role as UserRole,
          state: data.state || undefined,
          verified: data.verified,
          aadhaarVerified: data.aadhaar_verified,
          emailVerified: data.email_verified,
          phoneVerified: data.phone_verified,
          passportVerified: data.passport_verified,
          faceVerified: data.face_verified,
          partyId: data.party_id || undefined
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login successful");
      return true;
      
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info("You have been logged out");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  };
  
  // Register function
  const register = async (userData: Partial<AuthUser>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
            state: userData.state
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Registration successful. Please verify your details.");
      return true;
      
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // OTP verification function
  const verifyOTP = async (otp: string, type: "email" | "phone"): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc(
        'verify_otp',
        { p_user_id: user.id, p_code: otp, p_type: type }
      );
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Update local user state
        if (type === 'email') {
          setUser(prev => prev ? { ...prev, emailVerified: true } : null);
        } else {
          setUser(prev => prev ? { ...prev, phoneVerified: true } : null);
        }
        
        // Check if all verifications are complete
        const { data: checkResult } = await supabase.rpc(
          'check_verification_complete',
          { p_user_id: user.id }
        );
        
        if (checkResult) {
          setUser(prev => prev ? { ...prev, verified: true } : null);
        }
        
        toast.success(`${type === "email" ? "Email" : "Phone"} verified successfully`);
        return true;
      } else {
        toast.error("Invalid OTP");
        return false;
      }
      
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user function
  const updateUser = async (data: Partial<AuthUser>) => {
    if (!user) return;
    
    try {
      // Map the data to the database column names
      const updateData: Record<string, any> = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.state !== undefined) updateData.state = data.state;
      if (data.verified !== undefined) updateData.verified = data.verified;
      if (data.aadhaarVerified !== undefined) updateData.aadhaar_verified = data.aadhaarVerified;
      if (data.emailVerified !== undefined) updateData.email_verified = data.emailVerified;
      if (data.phoneVerified !== undefined) updateData.phone_verified = data.phoneVerified;
      if (data.passportVerified !== undefined) updateData.passport_verified = data.passportVerified;
      if (data.faceVerified !== undefined) updateData.face_verified = data.faceVerified;
      if (data.partyId !== undefined) updateData.party_id = data.partyId;
      
      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setUser(prev => prev ? { ...prev, ...data } : null);
      }
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast.error(error.message || "Failed to update profile");
    }
  };
  
  // Send OTP function
  const sendOTP = async (type: "email" | "phone"): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc(
        'generate_otp',
        { p_user_id: user.id, p_type: type }
      );
      
      if (error) {
        throw error;
      }
      
      toast.success(`OTP sent to your ${type === "email" ? "email" : "phone"}. For demo, use any 6-digit number.`);
      return true;
      
    } catch (error: any) {
      toast.error(error.message || `Failed to send OTP to your ${type}`);
      return false;
    }
  };
  
  // Verify Aadhaar
  const verifyAadhaar = async (aadhaarId: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc(
        'verify_aadhaar',
        { p_user_id: user.id, p_aadhaar_id: aadhaarId }
      );
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUser(prev => prev ? { ...prev, aadhaarVerified: true } : null);
        
        // Check if all verifications are complete
        const { data: checkResult } = await supabase.rpc(
          'check_verification_complete',
          { p_user_id: user.id }
        );
        
        if (checkResult) {
          setUser(prev => prev ? { ...prev, verified: true } : null);
        }
        
        toast.success("Aadhaar verified successfully");
        return true;
      } else {
        toast.error("Invalid Aadhaar ID");
        return false;
      }
      
    } catch (error: any) {
      toast.error(error.message || "Aadhaar verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify Passport
  const verifyPassport = async (passportId: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc(
        'verify_passport',
        { p_user_id: user.id, p_passport_id: passportId }
      );
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUser(prev => prev ? { ...prev, passportVerified: true } : null);
        
        // Check if all verifications are complete
        const { data: checkResult } = await supabase.rpc(
          'check_verification_complete',
          { p_user_id: user.id }
        );
        
        if (checkResult) {
          setUser(prev => prev ? { ...prev, verified: true } : null);
        }
        
        toast.success("Passport verified successfully");
        return true;
      } else {
        toast.error("Invalid Passport ID");
        return false;
      }
      
    } catch (error: any) {
      toast.error(error.message || "Passport verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify Face
  const verifyFace = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const updateData = { face_verified: true };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setUser(prev => prev ? { ...prev, faceVerified: true } : null);
      
      toast.success("Face verification successful");
      return true;
      
    } catch (error: any) {
      toast.error(error.message || "Face verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        session,
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
