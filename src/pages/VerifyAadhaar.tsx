
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { VerificationProgress } from '@/components/ui-custom/VerificationProgress';

const aadhaarSchema = z.object({
  aadhaarId: z.string()
    .length(12, { message: 'Aadhaar number must be exactly 12 digits' })
    .regex(/^\d+$/, { message: 'Aadhaar number must contain only digits' })
});

type AadhaarForm = z.infer<typeof aadhaarSchema>;

const VerifyAadhaar = () => {
  const navigate = useNavigate();
  const { user, updateUser, verifyAadhaar } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    // If user has already verified Aadhaar, redirect to next step
    if (user.aadhaarVerified) {
      toast.success('Aadhaar already verified');
      navigate('/verify/email');
    }
    
    // Check if user role is overseas_voter, redirect to passport verification
    if (user.role === 'overseas_voter') {
      toast.info('As an overseas voter, you need to verify your passport instead');
      navigate('/verify/passport');
    }
  }, [user, navigate]);
  
  const form = useForm<AadhaarForm>({
    resolver: zodResolver(aadhaarSchema),
    defaultValues: {
      aadhaarId: ''
    }
  });
  
  const onSubmit = async (data: AadhaarForm) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Use the verifyAadhaar method from AuthContext
      const success = await verifyAadhaar(data.aadhaarId);
      
      if (success) {
        toast.success('Aadhaar verification successful');
        navigate('/verify/email');
      } else {
        toast.error('Invalid Aadhaar number. Please try again.');
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
              <CardTitle className="text-2xl font-bold text-center">Aadhaar Verification</CardTitle>
              <CardDescription className="text-center">
                Enter your 12-digit Aadhaar number to verify your identity
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="aadhaarId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your 12-digit Aadhaar number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>For demo, use any of these Aadhaar numbers:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>123456789012</li>
                      <li>987654321098</li>
                      <li>567890123456</li>
                    </ul>
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
                        'Verify Aadhaar'
                      )}
                    </Button>
                  </div>
                  
                  <VerificationProgress />
                </CardContent>
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerifyAadhaar;
