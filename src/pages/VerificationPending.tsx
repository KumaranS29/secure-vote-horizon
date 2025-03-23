
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

const VerificationPending = () => {
  const { user } = useAuth();
  
  // Determine what's missing for verification
  const getMissingVerifications = () => {
    if (!user) return [];
    
    const missing = [];
    
    if (!user.emailVerified) missing.push('Email');
    if (!user.phoneVerified) missing.push('Phone');
    
    if (user.role === 'overseas_voter') {
      if (!user.passportVerified) missing.push('Passport');
    } else {
      if (!user.aadhaarVerified) missing.push('Aadhaar');
    }
    
    if (user.role === 'candidate' && !user.partyId) {
      missing.push('Party ID');
    }
    
    return missing;
  };
  
  const missingVerifications = getMissingVerifications();
  
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
                {missingVerifications.length > 0 ? (
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                )}
              </div>
              
              <CardTitle className="text-2xl font-bold text-center">
                {missingVerifications.length > 0 
                  ? "Verification Required" 
                  : "Verification Complete"}
              </CardTitle>
              
              <CardDescription className="text-center">
                {missingVerifications.length > 0 
                  ? "You need to complete these verifications before you can access all features" 
                  : "Your account is now fully verified"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {missingVerifications.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Missing Verifications:</h3>
                    <ul className="list-disc pl-5 text-yellow-700 space-y-1">
                      {missingVerifications.map((item, index) => (
                        <li key={index}>{item} verification</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    {!user?.aadhaarVerified && user?.role !== 'overseas_voter' && (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/verify/aadhaar">Verify Aadhaar</Link>
                      </Button>
                    )}
                    
                    {!user?.passportVerified && user?.role === 'overseas_voter' && (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/verify/passport">Verify Passport</Link>
                      </Button>
                    )}
                    
                    {!user?.emailVerified && (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/verify/email">Verify Email</Link>
                      </Button>
                    )}
                    
                    {!user?.phoneVerified && (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/verify/phone">Verify Phone</Link>
                      </Button>
                    )}
                    
                    {user?.role === 'candidate' && !user?.partyId && (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/verify/party">Verify Party ID</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-700">
                    Congratulations! You have completed all required verifications. 
                    You now have full access to the Electra Voting System.
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  {missingVerifications.length > 0 
                    ? "Continue with Limited Access" 
                    : "Go to Dashboard"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerificationPending;
