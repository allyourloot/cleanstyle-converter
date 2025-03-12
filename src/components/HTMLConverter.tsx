
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CodeEditor from './CodeEditor';
import ConversionPreview from './ConversionPreview';
import { processHTML, generateStyledHTML, debugHTMLStructure } from '@/lib/htmlProcessor';
import { ArrowRight, RefreshCw, Trash2, Bug } from 'lucide-react';
import { toast } from 'sonner';

const HTMLConverter: React.FC = () => {
  const [inputHTML, setInputHTML] = useState('');
  const [processedHTML, setProcessedHTML] = useState('');
  const [styledHTML, setStyledHTML] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Process HTML when the convert button is clicked
  const handleConvert = () => {
    if (!inputHTML || !inputHTML.trim()) {
      toast.warning('Please paste some HTML first');
      return;
    }

    setError(null);
    setDebugInfo(null);
    setIsConverting(true);
    setProcessedHTML('');
    setStyledHTML('');
    
    // Use setTimeout to allow UI to update before processing
    setTimeout(() => {
      try {
        console.log('Starting HTML conversion process...');
        
        // First processing step - strip styles and structure
        const processed = processHTML(inputHTML);
        
        if (!processed || processed.trim() === '') {
          console.error('processHTML returned empty content');
          toast.error('Failed to process HTML. Please check your input.');
          setError('The HTML processor returned empty content. Your input might be invalid HTML or not contain supported elements.');
          
          // Generate debug info
          setDebugInfo(debugHTMLStructure(inputHTML));
          setIsConverting(false);
          return;
        }
        
        setProcessedHTML(processed);
        console.log('Processed HTML:', processed);
        
        // Second processing step - apply styling
        try {
          const styled = generateStyledHTML(processed);
          
          if (!styled || styled.trim() === '') {
            console.error('generateStyledHTML returned empty content');
            toast.error('Failed to generate styled HTML output');
            setError('The HTML styling process returned empty content. Please try with different HTML input.');
            setIsConverting(false);
            return;
          }
          
          setStyledHTML(styled);
          console.log('Styled HTML result ready');
          toast.success('HTML converted successfully');
        } catch (stylingError) {
          console.error('Error generating styled HTML:', stylingError);
          toast.error('Failed to style the processed HTML');
          setError(`Error styling the HTML: ${stylingError instanceof Error ? stylingError.message : 'Unknown error'}`);
        }
      } catch (processingError) {
        console.error('Error converting HTML:', processingError);
        toast.error('Failed to convert HTML. Please check your input.');
        setError(`Error processing the HTML: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`);
      } finally {
        setIsConverting(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setInputHTML('');
    setProcessedHTML('');
    setStyledHTML('');
    setError(null);
    setDebugInfo(null);
    toast.info('All content cleared');
  };

  // Handle example button click
  const loadExample = () => {
    const exampleHTML = `
<div style="font-family: Arial; color: #333;">
  <h2 style="color: blue; font-size: 24px;">Product Name XYZ-2000</h2>
  <p style="line-height: 1.6; font-size: 16px;">This premium product features advanced technology and superior build quality.</p>
  
  <h3 style="color: green; margin-top: 20px;">Product Specifications</h3>
  <ul style="list-style-type: circle;">
    <li>Dimensions: 10 x 5 x 2 inches</li>
    <li>Weight: 1.5 lbs</li>
    <li>Material: Aircraft-grade aluminum</li>
    <li>Battery Life: Up to 12 hours</li>
    <li>Connectivity: Bluetooth 5.0, WiFi 6</li>
    <li>Warranty: 2 years limited</li>
  </ul>
  
  <p style="font-style: italic; color: #666;">Order now for fast shipping!</p>
</div>
    `;
    
    setInputHTML(exampleHTML);
    setError(null);
    setDebugInfo(null);
    toast.info('Example HTML loaded');
  };

  const toggleDebugInfo = () => {
    if (!debugInfo && inputHTML) {
      setDebugInfo(debugHTMLStructure(inputHTML));
    } else {
      setDebugInfo(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border shadow-sm h-full">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-sm">Input HTML</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadExample}
                className="text-xs"
              >
                Load Example
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                className="text-xs"
              >
                <Trash2 size={14} className="mr-1" />
                Clear
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDebugInfo}
                className="text-xs"
              >
                <Bug size={14} className="mr-1" />
                Debug
              </Button>
            </div>
          </div>
          <div className="p-4">
            <CodeEditor
              value={inputHTML}
              onChange={setInputHTML}
              className="min-h-[300px]"
            />
            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-[200px]">
                <h4 className="text-sm font-semibold mb-2">HTML Structure Debug:</h4>
                <pre>{debugInfo}</pre>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleConvert} 
                disabled={isConverting || !inputHTML.trim()}
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
            </div>
          </div>
        </CardContent>
      </Card>

      <ConversionPreview 
        html={styledHTML} 
        rawHtml={processedHTML}
        error={error}
        className="h-full"
      />
    </div>
  );
};

export default HTMLConverter;
