
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

interface FormButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingText: string;
  text: string;
}

const FormButton: React.FC<FormButtonProps> = ({
  isLoading,
  loadingText,
  text,
  className,
  ...props
}) => {
  return (
    <Button
      className={`w-full ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  );
};

export default FormButton;
