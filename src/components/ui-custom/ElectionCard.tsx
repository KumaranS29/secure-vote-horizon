
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Election } from '@/context/ElectionContext';

interface ElectionCardProps {
  election: Election;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  // Badge color based on status
  const getBadgeVariant = () => {
    switch (election.status) {
      case 'Upcoming':
        return 'secondary';
      case 'Ongoing':
        return 'default';
      case 'Completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{election.title}</CardTitle>
          <Badge variant={getBadgeVariant()}>
            {election.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-2" />
            <div>
              <span className="font-medium">Start:</span> {formatDate(election.startDate)}
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={16} className="mr-2" />
            <div>
              <span className="font-medium">End:</span> {formatDate(election.endDate)}
            </div>
          </div>
          {election.state && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={16} className="mr-2" />
              <div>{election.state}</div>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Users size={16} className="mr-2" />
            <div>{election.candidates.length} Candidates</div>
          </div>
        </div>
        
        {election.status === 'Completed' && election.winner && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Winner</p>
            <p className="font-semibold">{election.winner.name}</p>
            <p className="text-sm text-muted-foreground">{election.winner.party}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/elections/${election.id}`} className="w-full">
          <Button className="w-full">
            {election.status === 'Ongoing' 
              ? 'Vote Now' 
              : election.status === 'Upcoming' 
                ? 'View Details' 
                : 'View Results'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
