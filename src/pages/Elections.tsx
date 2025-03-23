
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import ElectionCard from '@/components/ui-custom/ElectionCard';
import { useElection } from '@/context/ElectionContext';
import { useAuth } from '@/context/AuthContext';

const Elections = () => {
  const { user } = useAuth();
  const { 
    activeElections, 
    upcomingElections, 
    completedElections, 
    getElectionsByRole 
  } = useElection();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [electionTypeFilter, setElectionTypeFilter] = useState<string>('all');
  
  // States list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
  ];
  
  // Apply filters
  const filterElections = (elections) => {
    return elections.filter(election => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        election.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // State filter
      const matchesState = stateFilter === 'all' || 
        election.state === stateFilter || 
        (election.type === 'General' && stateFilter !== 'all');
      
      // Election type filter
      const matchesType = electionTypeFilter === 'all' || 
        election.type === electionTypeFilter;
      
      return matchesSearch && matchesState && matchesType;
    });
  };
  
  // Filtered elections
  const filteredActive = filterElections(activeElections);
  const filteredUpcoming = filterElections(upcomingElections);
  const filteredCompleted = filterElections(completedElections);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Elections</h1>
            <p className="text-lg text-muted-foreground">
              View all active, upcoming, and past elections. Cast your vote and make your voice heard.
            </p>
          </motion.div>
        </div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search elections"
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-full md:w-48">
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <Select value={electionTypeFilter} onValueChange={setElectionTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="State">State</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={18} />
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Elections tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="active" className="w-full mb-16">
            <TabsList className="grid w-full grid-cols-3 mb-10">
              <TabsTrigger value="active" className="text-base py-3">Active</TabsTrigger>
              <TabsTrigger value="upcoming" className="text-base py-3">Upcoming</TabsTrigger>
              <TabsTrigger value="completed" className="text-base py-3">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActive.length > 0 ? (
                  filteredActive.map(election => (
                    <ElectionCard key={election.id} election={election} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground">No active elections found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcoming.length > 0 ? (
                  filteredUpcoming.map(election => (
                    <ElectionCard key={election.id} election={election} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground">No upcoming elections found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompleted.length > 0 ? (
                  filteredCompleted.map(election => (
                    <ElectionCard key={election.id} election={election} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground">No completed elections found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Elections;
