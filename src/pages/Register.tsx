
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/layout/Layout';
import { useAuth, UserRole } from '@/context/AuthContext';

// States list
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

// Form schema
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.nativeEnum(UserRole),
  state: z.string().optional(),
  partyId: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// OTP schema
const otpSchema = z.object({
  emailOtp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6),
  phoneOtp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6),
});

type OtpFormValues = z.infer<typeof otpSchema>;

// Verification schema
const verificationSchema = z.object({
  aadhaarId: z.string().min(12, { message: 'Aadhaar ID must be 12 digits' }).max(12),
  passportId: z.string().min(8, { message: 'Passport ID must be 8 characters' }).optional(),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { register, sendOTP, verifyOTP, verifyAadhaar, verifyPassport } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterComplete, setIsRegisterComplete] = useState(false);
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPhone, setRegisteredPhone] = useState('');
  const [registeredRole, setRegisteredRole] = useState<UserRole>(UserRole.Voter);
  const [currentTab, setCurrentTab] = useState("register");
  
  // Form for registration
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: UserRole.Voter,
      state: indianStates[0],
    },
  });
  
  // Form for OTP verification
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      emailOtp: '',
      phoneOtp: '',
    },
  });
  
  // Form for ID verification
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      aadhaarId: '',
      passportId: '',
    },
  });
  
  // Watch for changes in selected role
  const selectedRole = registerForm.watch("role");
  
  // Handle registration submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    const success = await register({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      state: data.state,
      partyId: data.partyId,
    }, data.password);
    
    if (success) {
      setRegisteredEmail(data.email);
      setRegisteredPhone(data.phone);
      setRegisteredRole(data.role);
      setIsRegisterComplete(true);
      setCurrentTab("otp");
      await sendOTP('email');
      await sendOTP('phone');
    }
  };
  
  // Handle OTP submission
  const onOtpSubmit = async (data: OtpFormValues) => {
    const emailSuccess = await verifyOTP(data.emailOtp, 'email');
    const phoneSuccess = await verifyOTP(data.phoneOtp, 'phone');
    
    if (emailSuccess && phoneSuccess) {
      setIsOtpComplete(true);
      setCurrentTab("verification");
    }
  };
  
  // Handle verification submission
  const onVerificationSubmit = async (data: VerificationFormValues) => {
    let success = false;
    
    if (registeredRole === UserRole.OverseasVoter) {
      // For overseas voters, verify passport
      if (data.passportId) {
        success = await verifyPassport(data.passportId);
      }
    } else {
      // For all other roles, verify Aadhaar
      success = await verifyAadhaar(data.aadhaarId);
    }
    
    if (success) {
      navigate('/login');
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Register to start voting in elections</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-border"
        >
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="register">Details</TabsTrigger>
              <TabsTrigger value="otp" disabled={!isRegisterComplete}>Verify OTP</TabsTrigger>
              <TabsTrigger value="verification" disabled={!isOtpComplete}>ID Verify</TabsTrigger>
            </TabsList>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Register as</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.Voter}>Voter</SelectItem>
                            <SelectItem value={UserRole.OverseasVoter}>Overseas Voter</SelectItem>
                            <SelectItem value={UserRole.Candidate}>Political Candidate</SelectItem>
                            <SelectItem value={UserRole.StateOfficial}>State Election Official</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="10-digit number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedRole === UserRole.Candidate && (
                    <FormField
                      control={registerForm.control}
                      name="partyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Party ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter party ID" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">
                            For demo use: BJP001, INC002, AAP003
                          </p>
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full group">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Already have an account? 
                      <Link to="/login" className="text-primary hover:underline ml-1">
                        Log in
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="otp">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  We've sent verification codes to your email and phone
                </p>
              </div>
              
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="emailOtp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Verification Code</FormLabel>
                        <FormControl>
                          <Input placeholder="6-digit code" {...field} maxLength={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={otpForm.control}
                    name="phoneOtp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Verification Code</FormLabel>
                        <FormControl>
                          <Input placeholder="6-digit code" {...field} maxLength={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentTab("register")}
                      className="group"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Back
                    </Button>
                    <Button type="submit" className="group">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </form>
              </Form>
              
              {/* Demo OTP info */}
              <Alert className="mt-6 bg-muted/50 border-muted">
                <AlertDescription>
                  <p className="text-xs mb-1">For demo, use any 6-digit number (e.g., 123456)</p>
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="verification">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Please verify your identity with 
                  {registeredRole === UserRole.OverseasVoter 
                    ? ' your passport details' 
                    : ' your Aadhaar details'}
                </p>
              </div>
              
              <Form {...verificationForm}>
                <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                  {registeredRole !== UserRole.OverseasVoter ? (
                    <FormField
                      control={verificationForm.control}
                      name="aadhaarId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number</FormLabel>
                          <FormControl>
                            <Input placeholder="12-digit Aadhaar number" {...field} maxLength={12} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={verificationForm.control}
                      name="passportId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter passport number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentTab("otp")}
                      className="group"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Back
                    </Button>
                    <Button type="submit">Complete Registration</Button>
                  </div>
                </form>
              </Form>
              
              {/* Demo verification info */}
              <Alert className="mt-6 bg-muted/50 border-muted">
                <AlertDescription>
                  <p className="text-xs mb-1">For demo, use:</p>
                  {registeredRole !== UserRole.OverseasVoter ? (
                    <p className="text-xs">Aadhaar: 123456789012</p>
                  ) : (
                    <p className="text-xs">Passport: A1234567</p>
                  )}
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Register;
