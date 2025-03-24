
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/context/AuthContext';

type VerificationStep = {
  id: string;
  label: string;
  path: string;
  completed: boolean;
  required: boolean;
  icon: React.ReactNode;
};

export const VerificationProgress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Determine verification steps based on user role
  const getVerificationSteps = (): VerificationStep[] => {
    const steps: VerificationStep[] = [];
    
    // ID verification (Aadhaar or Passport)
    if (user.role === UserRole.OverseasVoter) {
      steps.push({
        id: 'passport',
        label: 'Passport Verification',
        path: '/verify/passport',
        completed: !!user.passportVerified,
        required: true,
        icon: user.passportVerified 
          ? <CheckCircle2 className="h-5 w-5 text-green-500" />
          : <Clock className="h-5 w-5 text-amber-500" />
      });
    } else {
      steps.push({
        id: 'aadhaar',
        label: 'Aadhaar Verification',
        path: '/verify/aadhaar',
        completed: !!user.aadhaarVerified,
        required: true,
        icon: user.aadhaarVerified 
          ? <CheckCircle2 className="h-5 w-5 text-green-500" />
          : <Clock className="h-5 w-5 text-amber-500" />
      });
    }
    
    // Contact verification
    steps.push({
      id: 'email',
      label: 'Email Verification',
      path: '/verify/email',
      completed: !!user.emailVerified,
      required: true,
      icon: user.emailVerified 
        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
        : <Clock className="h-5 w-5 text-amber-500" />
    });
    
    steps.push({
      id: 'phone',
      label: 'Phone Verification',
      path: '/verify/phone',
      completed: !!user.phoneVerified,
      required: true,
      icon: user.phoneVerified 
        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
        : <Clock className="h-5 w-5 text-amber-500" />
    });
    
    // Biometric verification
    steps.push({
      id: 'face',
      label: 'Face Verification',
      path: '/verify/face',
      completed: !!user.faceVerified,
      required: true,
      icon: user.faceVerified 
        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
        : <Clock className="h-5 w-5 text-amber-500" />
    });
    
    // Party registration (candidates only)
    if (user.role === UserRole.Candidate) {
      steps.push({
        id: 'party',
        label: 'Party Registration',
        path: '/verify/party',
        completed: !!user.partyId,
        required: true,
        icon: user.partyId 
          ? <CheckCircle2 className="h-5 w-5 text-green-500" />
          : <Clock className="h-5 w-5 text-amber-500" />
      });
    }
    
    return steps;
  };
  
  const steps = getVerificationSteps();
  const currentStep = steps.find(step => !step.completed);
  const progress = Math.round((steps.filter(step => step.completed).length / steps.length) * 100);
  
  return (
    <div className="w-full space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Verification Progress</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="space-y-2 mt-4">
        {steps.map((step) => (
          <div 
            key={step.id}
            className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {step.icon}
              <span className="font-medium">{step.label}</span>
            </div>
            
            {!step.completed && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(step.path)}
              >
                Complete
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {currentStep && (
        <div className="flex items-start mt-4 p-3 rounded-md bg-blue-50 text-blue-800">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Next step: {currentStep.label}</p>
            <p className="text-sm mt-1">
              Complete this step to continue your verification process.
            </p>
          </div>
        </div>
      )}
      
      {progress === 100 && (
        <div className="flex items-start mt-4 p-3 rounded-md bg-green-50 text-green-800">
          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Verification Complete!</p>
            <p className="text-sm mt-1">
              All required verification steps are completed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
