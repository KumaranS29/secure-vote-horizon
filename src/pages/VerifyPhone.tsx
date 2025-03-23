
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Phone, Redo } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' })
});

type OtpForm = z.infer<typeof otpSchema>;

const VerifyPhone = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    // If user has already verified phone, redirect to dashboard
    if (user.phoneVerified) {
      toast.success('Phone already verified');
      navigate('/dashboard');
    } else {
      // Send OTP on initial load
      handleSendOTP();
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);
  
  const form = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });
  
  const handleSendOTP = async () => {
    if (!user) return;
    
    setResendDisabled(true);
    setCountdown(60);
    
    try {
      // Generate and send OTP
      const { data, error } = await supabase.rpc(
        'generate_otp', 
        { p_user_id: user.id, p_type: 'phone' }
      );
      
      if (error) throw new Error(error.message);
      
      toast.success(`OTP sent to your phone. For demo purposes, use any 6-digit number.`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP. Please try again.');
      setResendDisabled(false);
      setCountdown(0);
    }
  };
  
  const onSubmit = async (data: OtpForm) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Verify OTP
      const { data: verificationResult, error } = await supabase.rpc(
        'verify_otp',
        { p_user_id: user.id, p_code: data.otp, p_type: 'phone' }
      );
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (verificationResult) {
        // Update local user state
        updateUser({ phoneVerified: true });
        
        // Check if all verifications are complete
        const { data: checkResult } = await supabase.rpc(
          'check_verification_complete',
          { p_user_id: user.id }
        );
        
        toast.success('Phone verification successful');
        
        // Redirect based on user role and verification status
        if (user.role === 'candidate' && (!user.partyId || !user.verified)) {
          navigate('/verify/party');
        } else if (user.verified) {
          navigate('/dashboard');
        } else {
          navigate('/verification-pending');
        }
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-muted/30 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Phone Verification</CardTitle>
              <CardDescription className="text-center">
                Enter the 6-digit code sent to your phone number
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="mx-auto">
                        <FormLabel className="text-center block">Verification Code</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-sm text-center text-muted-foreground">
                    Didn't receive a code?{' '}
                    <Button
                      variant="link"
                      type="button"
                      className="p-0 h-auto text-sm"
                      onClick={handleSendOTP}
                      disabled={resendDisabled}
                    >
                      <Redo className="h-3 w-3 mr-1" />
                      {resendDisabled 
                        ? `Resend in ${countdown}s` 
                        : 'Resend code'}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-center text-muted-foreground mt-2">
                    <p>For demo, use any 6-digit number (e.g., 123456)</p>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Phone'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerifyPhone;
