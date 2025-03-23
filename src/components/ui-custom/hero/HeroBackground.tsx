
import React from 'react';
import { motion } from 'framer-motion';

const HeroBackground: React.FC = () => {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-50/20 to-transparent"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary"
          style={{ filter: 'blur(80px)' }}
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-400"
          style={{ filter: 'blur(80px)' }}
        ></motion.div>
      </div>
    </>
  );
};

export default HeroBackground;
