
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Flag, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 pt-16 pb-24">
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
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-start space-x-3"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Secure Verification</h3>
                  <p className="text-sm text-muted-foreground">Multi-factor authentication with Aadhaar and biometric verification.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Blockchain Technology</h3>
                  <p className="text-sm text-muted-foreground">Immutable vote records ensuring tamper-proof election results.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-start space-x-3"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <Flag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">National & State Elections</h3>
                  <p className="text-sm text-muted-foreground">Support for all types of elections from local to national level.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-start space-x-3"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Overseas Voting</h3>
                  <p className="text-sm text-muted-foreground">Special provisions for overseas citizens to participate remotely.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-2xl transform rotate-3 scale-105"></div>
              <div className="relative bg-white backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="bg-primary/5 p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-primary/10 px-3 py-1 rounded-full text-xs font-medium text-primary">
                      Ongoing Election
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ends in 2 days
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Lok Sabha Elections 2023</h3>
                  <p className="text-sm text-muted-foreground mb-4">National General Elections</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Voter Turnout</span>
                      <span className="text-sm font-medium">68.7%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '68.7%' }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-full bg-primary"
                      ></motion.div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Cast Your Vote</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        AS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Aditya Singh</p>
                      <p className="text-xs text-muted-foreground">Bharatiya Janata Party</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        PS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Priya Sharma</p>
                      <p className="text-xs text-muted-foreground">Indian National Congress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        RV
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Rahul Verma</p>
                      <p className="text-xs text-muted-foreground">Aam Aadmi Party</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
