
import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/context/ElectionContext';

interface CandidateCardProps {
  candidate: Candidate;
  showVoteButton?: boolean;
  onVote?: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  showVoteButton = false,
  onVote
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
          <AvatarImage src={candidate.profileImage} alt={candidate.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {candidate.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold leading-none">{candidate.name}</h3>
          <div className="flex items-center mt-1">
            <span className="text-sm text-muted-foreground">{candidate.party}</span>
            {candidate.partyId && candidate.partyId !== "IND000" && (
              <BadgeCheck size={16} className="ml-1 text-primary" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 mt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-1.5" />
            <div>
              {candidate.constituency}, {candidate.state}
            </div>
          </div>
        </div>
        
        {candidate.voteCount !== undefined && (
          <div className="mt-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {candidate.voteCount} votes
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {showVoteButton ? (
          <Button 
            className="w-full"
            onClick={onVote}
          >
            Vote
          </Button>
        ) : (
          <Link to={`/candidates/${candidate.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
