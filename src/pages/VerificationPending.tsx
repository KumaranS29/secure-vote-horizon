
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth, UserRole } from '@/context/AuthContext';

const VerificationPending = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getVerificationStatus = () => {
    if (!user) return null;
    
    const verifications = [
      {
        label: 'Email Verification',
        completed: user.emailVerified,
        path: '/verify/email'
      },
      {
        label: 'Phone Verification',
        completed: user.phoneVerified,
        path: '/verify/phone'
      }
    ];
    
    // Add ID verification based on user role
    if (user.role === UserRole.OverseasVoter) {
      verifications.unshift({
        label: 'Passport Verification',
        completed: user.passportVerified,
        path: '/verify/passport'
      });
    } else {
      verifications.unshift({
        label: 'Aadhaar Verification',
        completed: user.aadhaarVerified,
        path: '/verify/aadhaar'
      });
    }
    
    // Add face verification
    verifications.push({
      label: 'Face Verification',
      completed: user.faceVerified,
      path: '/verify/face'
    });
    
    // Add party registration for candidates
    if (user.role === UserRole.Candidate) {
      verifications.push({
        label: 'Party Registration',
        completed: !!user.partyId,
        path: '/verify/party'
      });
    }
    
    return verifications;
  };
  
  const verifications = getVerificationStatus();
  const pendingVerification = verifications?.find(v => !v.completed);

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
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {verifications?.map((verification, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 rounded-lg border"
                  >
                    {verification.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-amber-500 mr-3 flex-shrink-0"></div>
                    )}
                    <div className="flex-grow">
                      <p className="font-medium">{verification.label}</p>
                    </div>
                    {!verification.completed && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(verification.path)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <ShieldCheck className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Verification Status</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {pendingVerification 
                        ? `Please complete your ${pendingVerification.label.toLowerCase()} to proceed.`
                        : 'All verifications complete! Your account is under review.'}
                    </p>
                  </div>
                </div>
              </div>
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
