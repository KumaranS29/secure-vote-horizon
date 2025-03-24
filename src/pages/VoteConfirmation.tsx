
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const VoteConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { electionTitle } = location.state || {};

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Vote Successfully Recorded</h1>
          
          <p className="text-muted-foreground mb-6">
            Your vote for {electionTitle} has been securely recorded. Thank you for participating in the democratic process.
          </p>
          
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => navigate('/elections')}
            >
              View Other Elections
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VoteConfirmation;
