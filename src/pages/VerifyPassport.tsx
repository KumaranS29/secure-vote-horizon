
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

const passportSchema = z.object({
  passportId: z.string()
    .min(8, { message: 'Passport ID must be at least 8 characters' })
    .max(10, { message: 'Passport ID must not exceed 10 characters' })
});

type PassportForm = z.infer<typeof passportSchema>;

const VerifyPassport = () => {
  const navigate = useNavigate();
  const { user, updateUser, verifyPassport } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    // If user has already verified Passport, redirect to next step
    if (user.passportVerified) {
      toast.success('Passport already verified');
      navigate('/verify/email');
    }
    
    // Check if user is an overseas voter
    if (user.role !== 'overseas_voter') {
      toast.info('This verification is only for overseas voters. Redirecting to Aadhaar verification.');
      navigate('/verify/aadhaar');
    }
  }, [user, navigate]);
  
  const form = useForm<PassportForm>({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      passportId: ''
    }
  });
  
  const onSubmit = async (data: PassportForm) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Use the verifyPassport method from AuthContext
      const success = await verifyPassport(data.passportId);
      
      if (success) {
        toast.success('Passport verification successful');
        navigate('/verify/email');
      } else {
        toast.error('Invalid Passport ID. Please try again.');
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
              <CardTitle className="text-2xl font-bold text-center">Passport Verification</CardTitle>
              <CardDescription className="text-center">
                Enter your Passport ID to verify your identity as an overseas voter
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
                    name="passportId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passport ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Passport ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>For demo, use any of these Passport IDs:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>A1234567</li>
                      <li>B7654321</li>
                      <li>C9876543</li>
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
                        'Verify Passport'
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

export default VerifyPassport;
