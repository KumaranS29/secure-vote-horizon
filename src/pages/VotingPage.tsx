
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useElection } from '@/context/ElectionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import CandidateVotingCard from '@/components/ui-custom/CandidateVotingCard';
import VoteConfirmationDialog from '@/components/ui-custom/VoteConfirmationDialog';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const VotingPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getElection } = useElection();
  
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const election = getElection(electionId || '');
  
  if (!election) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Election not found</p>
        </div>
      </Layout>
    );
  }

  const handleVote = async () => {
    if (!selectedCandidate || !user || isVoting) return;
    
    setIsVoting(true);
    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('voter_id', user.id)
        .eq('election_id', electionId)
        .single();

      if (existingVote) {
        toast({
          variant: "destructive",
          title: "Already Voted",
          description: "You have already cast your vote in this election.",
        });
        return;
      }

      // Create vote record
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          election_id: electionId,
          candidate_id: selectedCandidate,
          voter_id: user.id,
          blockchain_hash: `0x${Math.random().toString(16).substring(2)}`, // Mock blockchain hash
        });

      if (voteError) throw voteError;

      // Update candidate vote count
      const { error: updateError } = await supabase.rpc(
        'increment_candidate_votes',
        { candidate_id: selectedCandidate }
      );

      if (updateError) throw updateError;

      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded.",
      });

      navigate('/vote-confirmation', { 
        state: { 
          electionTitle: election.title,
          candidateId: selectedCandidate
        }
      });
    } catch (error) {
      console.error('Voting error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record your vote. Please try again.",
      });
    } finally {
      setIsVoting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{election.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Select your preferred candidate and submit your vote.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {election.candidates.map((candidate) => (
            <CandidateVotingCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidate === candidate.id}
              onSelect={() => setSelectedCandidate(candidate.id)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedCandidate || isVoting}
            onClick={() => setShowConfirmation(true)}
          >
            {isVoting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording Vote...
              </>
            ) : (
              'Submit Vote'
            )}
          </Button>
        </div>

        <VoteConfirmationDialog
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleVote}
          candidate={election.candidates.find(c => c.id === selectedCandidate)}
        />
      </div>
    </Layout>
  );
};

export default VotingPage;
