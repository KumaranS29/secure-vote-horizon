
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface AuthFormWrapperProps {
  children: ReactNode;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-muted/30 shadow-lg">
          {children}
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthFormWrapper;
