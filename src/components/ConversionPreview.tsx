
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClipboardCopy, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ConversionPreviewProps {
  html: string;
  rawHtml: string;
  error?: string | null;
  className?: string;
}

const ConversionPreview: React.FC<ConversionPreviewProps> = ({
  html,
  rawHtml,
  error,
  className
}) => {
  const copyToClipboard = () => {
    if (!rawHtml || rawHtml.trim() === '') {
      toast.error('No HTML content to copy');
      return;
    }
    
    navigator.clipboard.writeText(rawHtml)
      .then(() => {
        toast.success('HTML copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy HTML');
      });
  };

  // Add these styles to the document to make the preview responsive and handle iframes/embeds
  React.useEffect(() => {
    const styleId = 'responsive-embed-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .responsive-embed {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          height: 0;
          overflow: hidden;
          width: 100%;
          margin-bottom: 1.5rem;
        }
        .responsive-embed iframe,
        .responsive-embed embed,
        .responsive-embed object {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Clean up is optional here since we want these styles to persist
    };
  }, []);

  return (
    <div className={cn("bg-white rounded-lg border shadow-sm overflow-hidden", className)}>
      <div className="flex items-center justify-between p-3 border-b bg-secondary/50">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Eye size={16} />
          <span>Preview</span>
          {html && <span className="text-xs opacity-70">({(html.length / 1024).toFixed(1)}KB)</span>}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs group"
          onClick={copyToClipboard}
          disabled={!rawHtml}
        >
          <ClipboardCopy size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Copy HTML</span>
        </Button>
      </div>
      
      <div className="p-6 max-h-[800px] overflow-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center h-[300px] animate-fade-in">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center mb-2">
                <AlertTriangle size={20} className="text-red-500 mr-2" />
                <h3 className="text-red-800 font-medium">Conversion Error</h3>
              </div>
              <p className="text-red-600 text-sm">{error}</p>
              <p className="text-xs text-red-500 mt-2">Try adjusting your HTML input or using the example.</p>
            </div>
          </div>
        ) : html ? (
          <div 
            className="html-preview animate-fade-in"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground animate-float">
            <p className="text-center max-w-md">
              Your converted HTML will appear here with clean styling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionPreview;
