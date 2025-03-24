
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Vote, ListFilter, BarChart3, Flag, UserCheck, AlertTriangle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useElection } from '@/context/ElectionContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    activeElections, 
    upcomingElections, 
    completedElections,
    isLoading: electionLoading 
  } = useElection();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please log in to access the dashboard');
      navigate('/login');
      return;
    }
    
    // If user isn't verified yet, redirect to verification page
    if (user && !user.verified) {
      const isOverseasVoter = user.role === UserRole.OverseasVoter;
      
      if (isOverseasVoter) {
        if (!user.passportVerified) {
          navigate('/verify/passport');
          return;
        }
      } else {
        if (!user.aadhaarVerified) {
          navigate('/verify/aadhaar');
          return;
        }
      }
      
      if (!user.emailVerified) {
        navigate('/verify/email');
        return;
      }
      
      if (!user.phoneVerified) {
        navigate('/verify/phone');
        return;
      }
      
      navigate('/verification-pending');
    }
  }, [user, authLoading, navigate]);
  
  if (authLoading || electionLoading) {
    return (
      <Layout>
        <div className="container py-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold">Loading your dashboard...</h2>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!user) return null;
  
  // Render dashboard based on user role
  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case UserRole.Voter:
      case UserRole.OverseasVoter:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Voting Status</CardTitle>
                <CardDescription>Track your participation in elections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Elections</span>
                    <span className="font-semibold">{activeElections.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Upcoming Elections</span>
                    <span className="font-semibold">{upcomingElections.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Elections Participated</span>
                    <span className="font-semibold">0</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={() => navigate('/elections')}
                  >
                    View Elections
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Your identity verification details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${user.emailVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>Email Verification</span>
                    <span className="ml-auto font-medium">{user.emailVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${user.phoneVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>Phone Verification</span>
                    <span className="ml-auto font-medium">{user.phoneVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                  {user.role === UserRole.OverseasVoter ? (
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${user.passportVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span>Passport Verification</span>
                      <span className="ml-auto font-medium">{user.passportVerified ? 'Verified' : 'Pending'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${user.aadhaarVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span>Aadhaar Verification</span>
                      <span className="ml-auto font-medium">{user.aadhaarVerified ? 'Verified' : 'Pending'}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${user.faceVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>Face Verification</span>
                    <span className="ml-auto font-medium">{user.faceVerified ? 'Verified' : 'Not Verified'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case UserRole.Candidate:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Status</CardTitle>
                <CardDescription>Your candidacy information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Elections Running In</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Party Affiliation</span>
                    <span className="font-semibold">{user.partyId || "Independent"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Votes Received</span>
                    <span className="font-semibold">0</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={() => navigate('/elections')}
                  >
                    View Elections
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Your identity verification details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${user.emailVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>Email Verification</span>
                    <span className="ml-auto font-medium">{user.emailVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${user.phoneVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>Phone Verification</span>
                    <span className="ml-auto font-medium">{user.phoneVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${user.aadhaarVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>Aadhaar Verification</span>
                    <span className="ml-auto font-medium">{user.aadhaarVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${user.partyId ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>Party Registration</span>
                    <span className="ml-auto font-medium">{user.partyId ? 'Registered' : 'Pending'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case UserRole.StateOfficial:
      case UserRole.Admin:
        return (
          <>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="elections">Elections</TabsTrigger>
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="voters">Voters</TabsTrigger>
                <TabsTrigger value="fraud">Fraud Alerts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Vote className="mr-2 h-5 w-5 text-blue-500" />
                        Active Elections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{activeElections.length}</p>
                      <p className="text-sm text-muted-foreground">
                        {activeElections.length > 0 
                          ? "Elections currently in progress"
                          : "No active elections"}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <UserCheck className="mr-2 h-5 w-5 text-green-500" />
                        Total Candidates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {activeElections.reduce((sum, e) => sum + e.candidates.length, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Candidates registered for current elections
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                        Fraud Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">
                        No suspicious activities detected
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5 text-indigo-500" />
                        Recent Election Statistics
                      </CardTitle>
                      <CardDescription>
                        Voter turnout and participation data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p>Statistics visualization will appear here</p>
                        <p className="text-sm mt-2">No completed elections data yet</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Flag className="mr-2 h-5 w-5 text-red-500" />
                        Upcoming Events
                      </CardTitle>
                      <CardDescription>
                        Important dates and deadlines
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {upcomingElections.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingElections.slice(0, 3).map((election) => (
                            <div key={election.id} className="flex justify-between items-center pb-3 border-b">
                              <div>
                                <p className="font-medium">{election.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(election.startDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">Manage</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-10">
                          <p>No upcoming elections</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="elections">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Election Management</CardTitle>
                      <Button>Create New Election</Button>
                    </div>
                    <CardDescription>
                      Manage all elections and their settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                      <p>Election management tools will be implemented here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="candidates">
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Management</CardTitle>
                    <CardDescription>
                      Approve and monitor candidates for elections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                      <p>Candidate management tools will be implemented here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="voters">
                <Card>
                  <CardHeader>
                    <CardTitle>Voter Management</CardTitle>
                    <CardDescription>
                      Monitor voter registrations and verification status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                      <p>Voter management tools will be implemented here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="fraud">
                <Card>
                  <CardHeader>
                    <CardTitle>Fraud Detection</CardTitle>
                    <CardDescription>
                      Monitor and investigate suspicious activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                      <p>Fraud detection tools will be implemented here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        );
        
      default:
        return (
          <div className="text-center py-10">
            <p>Welcome to the Electra Voting System</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user.name || 'User'}
              </p>
            </div>
            
            {(user.role === UserRole.StateOfficial || user.role === UserRole.Admin) && (
              <div className="mt-4 md:mt-0">
                <Button onClick={() => navigate('/elections')}>
                  View Elections
                </Button>
              </div>
            )}
          </div>
          
          {renderRoleSpecificContent()}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
