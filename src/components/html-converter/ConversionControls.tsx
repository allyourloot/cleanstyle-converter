
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bug, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ConversionControlsProps {
  inputHTML: string;
  onClear: () => void;
  onLoadExample: () => void;
  onToggleDebug: () => void;
}

const ConversionControls: React.FC<ConversionControlsProps> = ({
  inputHTML,
  onClear,
  onLoadExample,
  onToggleDebug
}) => (
  <div className="flex gap-2">
    <Button 
      variant="outline" 
      size="sm"
      onClick={onLoadExample}
      className="text-xs"
    >
      Load Example
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClear}
      className="text-xs"
    >
      <Trash2 size={14} className="mr-1" />
      Clear
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onToggleDebug}
      className="text-xs"
    >
      <Bug size={14} className="mr-1" />
      Debug
    </Button>
  </div>
);

export default ConversionControls;

