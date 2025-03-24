
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, PartyPopper, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { VerificationProgress } from '@/components/ui-custom/VerificationProgress';

const partySchema = z.object({
  partyId: z.string().min(1, { message: 'Please select a party' })
});

type PartyForm = z.infer<typeof partySchema>;

type Party = {
  party_id: string;
  party_name: string;
  party_short_name: string;
  symbol_url?: string;
};

const VerifyParty = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingParties, setLoadingParties] = useState(true);
  const [parties, setParties] = useState<Party[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    // If user is not a candidate, redirect
    if (user.role !== 'candidate') {
      toast.error('Only candidates need to register with a party');
      navigate('/dashboard');
      return;
    }
    
    // If user has already verified party, redirect to dashboard
    if (user.partyId) {
      toast.success('Party already registered');
      navigate('/dashboard');
    }
    
    // Load parties
    fetchParties();
  }, [user, navigate]);
  
  const fetchParties = async () => {
    try {
      const { data, error } = await supabase
        .from('mock_party_database')
        .select('*');
        
      if (error) throw error;
      
      setParties(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load parties');
    } finally {
      setLoadingParties(false);
    }
  };
  
  const form = useForm<PartyForm>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      partyId: ''
    }
  });
  
  const onSubmit = async (data: PartyForm) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update user profile with party ID
      const { error } = await supabase
        .from('profiles')
        .update({ party_id: data.partyId })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local user state
      updateUser({ partyId: data.partyId });
      
      toast.success('Party registration successful');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Party registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredParties = parties.filter(party => 
    party.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.party_short_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <CardTitle className="text-2xl font-bold text-center">Party Registration</CardTitle>
              <CardDescription className="text-center">
                As a candidate, select your political party affiliation
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <PartyPopper className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search parties..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="partyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Political Party</FormLabel>
                        <Select
                          disabled={loadingParties}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={loadingParties ? "Loading parties..." : "Select a party"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredParties.map((party) => (
                              <SelectItem key={party.party_id} value={party.party_id}>
                                <div className="flex items-center">
                                  {party.symbol_url && (
                                    <img 
                                      src={party.symbol_url} 
                                      alt={`${party.party_name} symbol`}
                                      className="w-5 h-5 mr-2"
                                    />
                                  )}
                                  <span>{party.party_name} ({party.party_short_name})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || loadingParties}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Register with Party'
                      )}
                    </Button>
                  </div>
                  
                  <VerificationProgress />
                </CardContent>
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerifyParty;
