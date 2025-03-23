
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Flag, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroFeature from './HeroFeature';

const HeroContent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Secure Digital Voting for a 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"> Modern Democracy</span>
        </h1>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-muted-foreground mb-6"
      >
        Experience a new era of transparent, secure, and accessible elections through our state-of-the-art digital voting platform powered by blockchain technology.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-12"
      >
        <Link to="/register">
          <Button size="lg" className="group">
            Register Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/elections">
          <Button variant="outline" size="lg">
            Explore Elections
          </Button>
        </Link>
      </motion.div>
      
      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HeroFeature 
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
          title="Secure Verification"
          description="Multi-factor authentication with Aadhaar and biometric verification."
          delay={0.4}
        />
        
        <HeroFeature 
          icon={<Lock className="h-5 w-5 text-primary" />}
          title="Blockchain Technology"
          description="Immutable vote records ensuring tamper-proof election results."
          delay={0.5}
        />
        
        <HeroFeature 
          icon={<Flag className="h-5 w-5 text-primary" />}
          title="National & State Elections"
          description="Support for all types of elections from local to national level."
          delay={0.6}
        />
        
        <HeroFeature 
          icon={<Users className="h-5 w-5 text-primary" />}
          title="Overseas Voting"
          description="Special provisions for overseas citizens to participate remotely."
          delay={0.7}
        />
      </div>
    </motion.div>
  );
};

export default HeroContent;
