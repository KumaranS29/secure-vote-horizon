
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Candidate } from '@/context/ElectionContext';

interface CandidateVotingCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
}

const CandidateVotingCard: React.FC<CandidateVotingCardProps> = ({
  candidate,
  isSelected,
  onSelect,
}) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          {candidate.profileImage ? (
            <AvatarImage src={candidate.profileImage} alt={candidate.name} />
          ) : (
            <AvatarFallback>
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {candidate.constituency} • {candidate.state}
        </p>
      </CardContent>
    </Card>
  );
};

export default CandidateVotingCard;
