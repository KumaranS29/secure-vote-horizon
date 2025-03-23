
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
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

// Form schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.nativeEnum(UserRole),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// OTP schema
const otpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginComplete, setIsLoginComplete] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.Voter);
  
  // Form for login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: UserRole.Voter,
    },
  });
  
  // Form for OTP
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });
  
  // Handle login submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    const success = await login(data.email, data.password, data.role);
    if (success) {
      setLoginEmail(data.email);
      setLoginRole(data.role);
      setIsLoginComplete(true);
      await sendOTP('email');
    }
  };
  
  // Handle OTP submission
  const onOtpSubmit = async (data: OtpFormValues) => {
    const success = await verifyOTP(data.otp, 'email');
    if (success) {
      navigate('/');
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
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Log in to your account to continue</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-border"
        >
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="otp" disabled={!isLoginComplete}>OTP Verification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login as</FormLabel>
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
                            <SelectItem value={UserRole.Admin}>Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
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
                    control={loginForm.control}
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
                  
                  <div className="text-right">
                    <Link to="/reset-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Log in
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account? 
                      <Link to="/register" className="text-primary hover:underline ml-1">
                        Register
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
              
              {/* Demo credentials */}
              <Alert className="mt-6 bg-muted/50 border-muted">
                <AlertDescription>
                  <p className="text-xs mb-1 font-medium">For demo purposes, use:</p>
                  <p className="text-xs">Email: admin@evoting.gov</p>
                  <p className="text-xs">Password: admin123</p>
                  <p className="text-xs">Role: Admin</p>
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="otp">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to {loginEmail}
                </p>
              </div>
              
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input placeholder="6-digit code" {...field} maxLength={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="ghost" onClick={() => sendOTP('email')}>
                      Resend Code
                    </Button>
                    <Button type="submit" className="group">
                      Verify
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
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
