
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface ConversionButtonProps {
  isConverting: boolean;
  disabled: boolean;
  onClick: () => void;
}

const ConversionButton: React.FC<ConversionButtonProps> = ({
  isConverting,
  disabled,
  onClick
}) => (
  <Button 
    onClick={onClick} 
    disabled={disabled}
    className="relative overflow-hidden group"
  >
    {isConverting ? (
      <>
        <RefreshCw size={16} className="mr-2 animate-spin" />
        Converting...
      </>
    ) : (
      <>
        Convert
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </>
    )}
  </Button>
);

export default ConversionButton;

