
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, FileCheck, Globe, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/ui-custom/HeroSection';
import ElectionCard from '@/components/ui-custom/ElectionCard';
import { useElection } from '@/context/ElectionContext';

const Index = () => {
  const { activeElections, upcomingElections } = useElection();
  
  // Features data
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Multi-Factor Authentication",
      description: "Secure your vote with Aadhaar verification, email, and mobile OTP verification to ensure that only eligible voters can participate."
    },
    {
      icon: <FileCheck className="h-6 w-6 text-primary" />,
      title: "Blockchain Vote Storage",
      description: "Your vote is stored on a secure blockchain, making it immutable and tamper-proof while maintaining privacy and anonymity."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Overseas Voter Support",
      description: "Indian citizens living abroad can participate in elections with passport verification and the same secure voting experience."
    },
    {
      icon: <Activity className="h-6 w-6 text-primary" />,
      title: "AI Fraud Detection",
      description: "Advanced AI algorithms constantly monitor voting patterns to detect and prevent fraud attempts in real-time."
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Active Elections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Active Elections</h2>
              <p className="text-muted-foreground">Cast your vote in these ongoing elections</p>
            </div>
            <Link to="/elections">
              <Button variant="ghost" className="group mt-4 md:mt-0">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeElections.length > 0 ? (
              activeElections.map(election => (
                <ElectionCard key={election.id} election={election} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No active elections at the moment</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Secure, Transparent & Accessible</h2>
            <p className="text-lg text-muted-foreground">
              Our digital voting platform ensures democratic processes are secure, 
              transparent, and accessible to all eligible voters.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="glass-card rounded-xl p-6 flex flex-col items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Upcoming Elections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Elections</h2>
              <p className="text-muted-foreground">Stay prepared for these upcoming elections</p>
            </div>
            <Link to="/elections">
              <Button variant="ghost" className="group mt-4 md:mt-0">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingElections.length > 0 ? (
              upcomingElections.map(election => (
                <ElectionCard key={election.id} election={election} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No upcoming elections at the moment</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to make your voice heard?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our secure digital voting platform today and participate in shaping the future of our democracy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="group">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
