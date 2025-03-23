
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { UserRole } from "./AuthContext";

// Election types
export interface Candidate {
  id: string;
  name: string;
  party: string;
  partyId: string;
  constituency: string;
  state: string;
  profileImage?: string;
  manifesto?: string;
  voteCount?: number;
}

export interface Election {
  id: string;
  title: string;
  type: "General" | "State" | "Local";
  state?: string;
  constituency?: string;
  startDate: Date;
  endDate: Date;
  status: "Upcoming" | "Ongoing" | "Completed";
  candidates: Candidate[];
  voterTurnout?: number;
  winner?: Candidate;
}

export interface Vote {
  id: string;
  electionId: string;
  voterId: string;
  candidateId: string;
  timestamp: Date;
  blockchainHash: string;
}

// Election context interface
interface ElectionContextType {
  elections: Election[];
  activeElections: Election[];
  upcomingElections: Election[];
  completedElections: Election[];
  userVotes: Vote[];
  isLoading: boolean;
  createElection: (electionData: Partial<Election>) => Promise<boolean>;
  updateElection: (id: string, electionData: Partial<Election>) => Promise<boolean>;
  addCandidate: (electionId: string, candidateData: Partial<Candidate>) => Promise<boolean>;
  castVote: (electionId: string, candidateId: string, voterId: string) => Promise<boolean>;
  getElection: (id: string) => Election | undefined;
  getElectionsByState: (state: string) => Election[];
  getElectionsByRole: (role: UserRole, state?: string) => Election[];
  getCandidate: (id: string) => Candidate | undefined;
}

// Creating the context with default values
const ElectionContext = createContext<ElectionContextType>({
  elections: [],
  activeElections: [],
  upcomingElections: [],
  completedElections: [],
  userVotes: [],
  isLoading: true,
  createElection: async () => false,
  updateElection: async () => false,
  addCandidate: async () => false,
  castVote: async () => false,
  getElection: () => undefined,
  getElectionsByState: () => [],
  getElectionsByRole: () => [],
  getCandidate: () => undefined
});

// Sample parties
const parties = [
  { id: "BJP001", name: "Bharatiya Janata Party", shortName: "BJP" },
  { id: "INC002", name: "Indian National Congress", shortName: "Congress" },
  { id: "AAP003", name: "Aam Aadmi Party", shortName: "AAP" },
  { id: "TMC004", name: "All India Trinamool Congress", shortName: "TMC" },
  { id: "CPIM005", name: "Communist Party of India (Marxist)", shortName: "CPI(M)" },
  { id: "IND000", name: "Independent", shortName: "IND" }
];

// Sample candidates
const sampleCandidates: Candidate[] = [
  {
    id: "c1",
    name: "Aditya Singh",
    party: "Bharatiya Janata Party",
    partyId: "BJP001",
    constituency: "South Delhi",
    state: "Delhi"
  },
  {
    id: "c2",
    name: "Priya Sharma",
    party: "Indian National Congress",
    partyId: "INC002",
    constituency: "South Delhi",
    state: "Delhi"
  },
  {
    id: "c3",
    name: "Rahul Verma",
    party: "Aam Aadmi Party",
    partyId: "AAP003",
    constituency: "South Delhi",
    state: "Delhi"
  },
  {
    id: "c4",
    name: "Neha Patel",
    party: "Indian National Congress",
    partyId: "INC002",
    constituency: "Mumbai South",
    state: "Maharashtra"
  },
  {
    id: "c5",
    name: "Vikram Desai",
    party: "Bharatiya Janata Party",
    partyId: "BJP001",
    constituency: "Mumbai South",
    state: "Maharashtra"
  }
];

// Mock elections data
const mockElections: Election[] = [
  {
    id: "e1",
    title: "Lok Sabha Elections 2023",
    type: "General",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: "Upcoming",
    candidates: [sampleCandidates[0], sampleCandidates[1], sampleCandidates[2]]
  },
  {
    id: "e2",
    title: "Delhi Assembly Elections 2023",
    type: "State",
    state: "Delhi",
    startDate: new Date(), // Today
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: "Ongoing",
    candidates: [sampleCandidates[0], sampleCandidates[1], sampleCandidates[2]]
  },
  {
    id: "e3",
    title: "Maharashtra Assembly Elections 2023",
    type: "State",
    state: "Maharashtra",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    status: "Completed",
    candidates: [sampleCandidates[3], sampleCandidates[4]],
    voterTurnout: 72,
    winner: sampleCandidates[4]
  }
];

// Mock votes
const mockVotes: Vote[] = [];

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>(mockElections);
  const [userVotes, setUserVotes] = useState<Vote[]>(mockVotes);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Derived states
  const activeElections = elections.filter(e => e.status === "Ongoing");
  const upcomingElections = elections.filter(e => e.status === "Upcoming");
  const completedElections = elections.filter(e => e.status === "Completed");
  
  // Load data on initial render
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setIsLoading(false);
  }, []);
  
  // Create a new election
  const createElection = async (electionData: Partial<Election>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const newElection: Election = {
        id: `e${Date.now()}`,
        title: electionData.title || "New Election",
        type: electionData.type || "General",
        state: electionData.state,
        constituency: electionData.constituency,
        startDate: electionData.startDate || new Date(),
        endDate: electionData.endDate || new Date(),
        status: electionData.status || "Upcoming",
        candidates: electionData.candidates || []
      };
      
      setElections(prev => [...prev, newElection]);
      toast.success("Election created successfully");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error creating election:", error);
      toast.error("Failed to create election");
      setIsLoading(false);
      return false;
    }
  };
  
  // Update an existing election
  const updateElection = async (id: string, electionData: Partial<Election>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      setElections(prev => prev.map(election => {
        if (election.id === id) {
          return { ...election, ...electionData };
        }
        return election;
      }));
      
      toast.success("Election updated successfully");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error updating election:", error);
      toast.error("Failed to update election");
      setIsLoading(false);
      return false;
    }
  };
  
  // Add a candidate to an election
  const addCandidate = async (electionId: string, candidateData: Partial<Candidate>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find the election
      const electionIndex = elections.findIndex(e => e.id === electionId);
      if (electionIndex === -1) {
        toast.error("Election not found");
        setIsLoading(false);
        return false;
      }
      
      // Create new candidate
      const newCandidate: Candidate = {
        id: `c${Date.now()}`,
        name: candidateData.name || "New Candidate",
        party: candidateData.party || "Independent",
        partyId: candidateData.partyId || "IND000",
        constituency: candidateData.constituency || elections[electionIndex].constituency || "",
        state: candidateData.state || elections[electionIndex].state || "",
        profileImage: candidateData.profileImage,
        manifesto: candidateData.manifesto
      };
      
      // Update elections array
      const updatedElections = [...elections];
      updatedElections[electionIndex].candidates.push(newCandidate);
      setElections(updatedElections);
      
      toast.success("Candidate added successfully");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error("Failed to add candidate");
      setIsLoading(false);
      return false;
    }
  };
  
  // Cast a vote
  const castVote = async (electionId: string, candidateId: string, voterId: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Check if user has already voted in this election
      const hasVoted = userVotes.some(vote => vote.electionId === electionId && vote.voterId === voterId);
      if (hasVoted) {
        toast.error("You have already voted in this election");
        setIsLoading(false);
        return false;
      }
      
      // Create a new vote
      const newVote: Vote = {
        id: `v${Date.now()}`,
        electionId,
        voterId,
        candidateId,
        timestamp: new Date(),
        blockchainHash: `0x${Math.random().toString(16).substring(2, 15)}` // Mock blockchain hash
      };
      
      // Add vote to user votes
      setUserVotes(prev => [...prev, newVote]);
      
      // Update candidate vote count
      setElections(prev => prev.map(election => {
        if (election.id === electionId) {
          return {
            ...election,
            candidates: election.candidates.map(candidate => {
              if (candidate.id === candidateId) {
                return {
                  ...candidate,
                  voteCount: (candidate.voteCount || 0) + 1
                };
              }
              return candidate;
            })
          };
        }
        return election;
      }));
      
      toast.success("Vote cast successfully");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote");
      setIsLoading(false);
      return false;
    }
  };
  
  // Get election by ID
  const getElection = (id: string): Election | undefined => {
    return elections.find(election => election.id === id);
  };
  
  // Get elections by state
  const getElectionsByState = (state: string): Election[] => {
    return elections.filter(election => 
      election.state === state || 
      election.type === "General"
    );
  };
  
  // Get elections by user role
  const getElectionsByRole = (role: UserRole, state?: string): Election[] => {
    switch (role) {
      case UserRole.Admin:
        return elections;
      case UserRole.StateOfficial:
        return state ? getElectionsByState(state) : [];
      case UserRole.Voter:
      case UserRole.OverseasVoter:
      case UserRole.Candidate:
        return state ? getElectionsByState(state) : elections.filter(e => e.type === "General");
      default:
        return [];
    }
  };
  
  // Get candidate by ID
  const getCandidate = (id: string): Candidate | undefined => {
    for (const election of elections) {
      const candidate = election.candidates.find(c => c.id === id);
      if (candidate) return candidate;
    }
    return undefined;
  };
  
  return (
    <ElectionContext.Provider
      value={{
        elections,
        activeElections,
        upcomingElections,
        completedElections,
        userVotes,
        isLoading,
        createElection,
        updateElection,
        addCandidate,
        castVote,
        getElection,
        getElectionsByState,
        getElectionsByRole,
        getCandidate
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => useContext(ElectionContext);
