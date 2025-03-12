
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CodeEditor from './CodeEditor';
import ConversionPreview from './ConversionPreview';
import { processHTML, generateStyledHTML } from '@/lib/htmlProcessor';
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const HTMLConverter: React.FC = () => {
  const [inputHTML, setInputHTML] = useState('');
  const [processedHTML, setProcessedHTML] = useState('');
  const [styledHTML, setStyledHTML] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // Process HTML when the convert button is clicked
  const handleConvert = () => {
    if (!inputHTML.trim()) {
      toast.warning('Please paste some HTML first');
      return;
    }

    setIsConverting(true);
    
    // Use setTimeout to allow UI to update before processing
    setTimeout(() => {
      try {
        console.log('Starting HTML conversion process...');
        console.log('Input HTML length:', inputHTML.length);
        
        // First processing step - strip styles and structure
        const processed = processHTML(inputHTML);
        console.log('Processed HTML length:', processed.length);
        
        if (!processed || processed.trim() === '') {
          console.error('processHTML returned empty content');
          toast.error('Failed to process HTML. Please check your input.');
          setIsConverting(false);
          return;
        }
        
        setProcessedHTML(processed);
        
        // Second processing step - apply styling
        const styled = generateStyledHTML(processed);
        console.log('Styled HTML length:', styled.length);
        
        if (!styled || styled.trim() === '') {
          console.error('generateStyledHTML returned empty content');
          toast.error('Failed to generate styled HTML output');
          setIsConverting(false);
          return;
        }
        
        setStyledHTML(styled);
        toast.success('HTML converted successfully');
      } catch (error) {
        console.error('Error converting HTML:', error);
        toast.error('Failed to convert HTML. Please check your input.');
      } finally {
        setIsConverting(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setInputHTML('');
    setProcessedHTML('');
    setStyledHTML('');
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
    toast.info('Example HTML loaded');
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
            </div>
          </div>
          <div className="p-4">
            <CodeEditor
              value={inputHTML}
              onChange={setInputHTML}
              className="min-h-[300px]"
            />
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
        className="h-full"
      />
    </div>
  );
};

export default HTMLConverter;
