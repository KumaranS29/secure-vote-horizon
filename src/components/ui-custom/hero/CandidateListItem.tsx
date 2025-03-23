
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CandidateListItemProps {
  initials: string;
  name: string;
  party: string;
}

const CandidateListItem: React.FC<CandidateListItemProps> = ({ initials, name, party }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{party}</p>
      </div>
    </div>
  );
};

export default CandidateListItem;
