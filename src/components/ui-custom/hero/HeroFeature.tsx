
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const HeroFeature: React.FC<HeroFeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex items-start space-x-3"
    >
      <div className="bg-primary/10 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

export default HeroFeature;
