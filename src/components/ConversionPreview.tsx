
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClipboardCopy, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ConversionPreviewProps {
  html: string;
  rawHtml: string;
  className?: string;
}

const ConversionPreview: React.FC<ConversionPreviewProps> = ({
  html,
  rawHtml,
  className
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawHtml)
      .then(() => {
        toast.success('HTML copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy HTML');
      });
  };

  return (
    <div className={cn("bg-white rounded-lg border shadow-sm overflow-hidden", className)}>
      <div className="flex items-center justify-between p-3 border-b bg-secondary/50">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Eye size={16} />
          <span>Preview</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs group"
          onClick={copyToClipboard}
        >
          <ClipboardCopy size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Copy HTML</span>
        </Button>
      </div>
      
      <div className="p-6 h-full overflow-auto">
        {html ? (
          <div 
            className="html-preview animate-fade-in"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground animate-fade-in">
            <p className="text-center max-w-md animate-float">
              Your converted HTML will appear here with clean styling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionPreview;
