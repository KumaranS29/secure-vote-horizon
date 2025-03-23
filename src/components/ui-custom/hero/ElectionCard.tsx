
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CandidateListItem from './CandidateListItem';

const ElectionCard: React.FC = () => {
  return (
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
            <CandidateListItem 
              initials="AS"
              name="Aditya Singh"
              party="Bharatiya Janata Party"
            />
            
            <CandidateListItem 
              initials="PS"
              name="Priya Sharma"
              party="Indian National Congress"
            />
            
            <CandidateListItem 
              initials="RV"
              name="Rahul Verma"
              party="Aam Aadmi Party"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ElectionCard;
