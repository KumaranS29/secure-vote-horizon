
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Candidate } from '@/context/ElectionContext';

interface VoteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidate: Candidate | undefined;
}

const VoteConfirmationDialog: React.FC<VoteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  candidate,
}) => {
  if (!candidate) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to cast your vote for:
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="font-medium">{candidate.name}</p>
              <p className="text-sm text-muted-foreground">{candidate.party}</p>
              <p className="text-sm text-muted-foreground">
                {candidate.constituency} • {candidate.state}
              </p>
            </div>
            <p className="mt-4">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm Vote
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VoteConfirmationDialog;
