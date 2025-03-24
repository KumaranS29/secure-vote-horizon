
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth, UserRole } from '@/context/AuthContext';
import { VerificationProgress } from '@/components/ui-custom/VerificationProgress';

const VerificationPending = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!user) {
    navigate('/login');
    return null;
  }

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
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Verification Pending</CardTitle>
              <CardDescription className="text-center">
                Your account is being verified. Please complete all verification steps to access the platform.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <ShieldCheck className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Verification Status</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {user.verified 
                        ? 'All verifications complete! Your account is ready to use.'
                        : 'Please complete all verification steps to access full platform features.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <VerificationProgress />
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerificationPending;
