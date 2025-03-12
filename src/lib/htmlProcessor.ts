
import { createDOMParser, wrapHTML, extractBodyContent, isElementNode } from './utils/domUtils';
import { applyElementStyles } from './utils/styleProcessor';
import { debugHTMLStructure } from './utils/debugUtils';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString?.trim()) {
      console.error('Empty HTML input');
      return '';
    }
    
    const parser = createDOMParser();
    const doc = parser.parseFromString(wrapHTML(htmlString), 'text/html');
    
    const body = doc.getElementsByTagName('body')[0];
    if (!body) {
      console.error('No body element found in parsed document');
      return '';
    }
    
    const processNode = (node: Node) => {
      if (!node) return;
      
      if (isElementNode(node)) {
        const element = node as Element;
        if (element.hasAttribute && element.hasAttribute('style')) {
          element.removeAttribute('style');
        }
        
        Array.from(node.childNodes || []).forEach(child => processNode(child));
      }
    };
    
    Array.from(body.childNodes || []).forEach(child => processNode(child));
    
    const bodyContent = extractBodyContent(body);
    
    if (!bodyContent?.trim()) {
      console.error('Processing resulted in empty content');
      return '';
    }
    
    console.log('Processed HTML successfully', bodyContent.length);
    return bodyContent;
  } catch (error) {
    console.error('Error in processHTML:', error);
    throw error;
  }
};

export const generateStyledHTML = (htmlString: string): string => {
  try {
    if (!htmlString?.trim()) {
      console.error('Empty HTML input for styling');
      return '';
    }
    
    const parser = createDOMParser();
    const doc = parser.parseFromString(wrapHTML(htmlString), 'text/html');
    
    const body = doc.getElementsByTagName('body')[0];
    if (!body) {
      console.error('No body element found for styling');
      return '';
    }
    
    const addStyles = (node: Node) => {
      if (!node) return;
      
      if (isElementNode(node)) {
        applyElementStyles(node as Element);
        
        Array.from(node.childNodes || []).forEach(child => addStyles(child));
      }
    };
    
    Array.from(body.childNodes || []).forEach(child => addStyles(child));
    
    const styledContent = extractBodyContent(body);
    
    if (!styledContent?.trim()) {
      console.error('Styling resulted in empty content');
      return '';
    }
    
    console.log('HTML styled successfully, length:', styledContent.length);
    return styledContent;
  } catch (error) {
    console.error('Error in generateStyledHTML:', error);
    throw error;
  }
};

export { debugHTMLStructure };
