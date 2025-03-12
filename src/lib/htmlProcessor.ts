
import { DOMParser } from '@xmldom/xmldom';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input');
      return '';
    }
    
    // Create a more robust parser setup
    const parser = new DOMParser();
    // Wrap in proper HTML structure
    const wrappedHTML = `<!DOCTYPE html><html><body>${htmlString}</body></html>`;
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    const body = doc.getElementsByTagName('body')[0];
    if (!body) {
      console.error('No body element found in parsed document');
      return '';
    }
    
    // Convert NodeList to Array for easier processing
    const processNode = (node) => {
      if (!node) return;
      
      // Handle element nodes
      if (node.nodeType === 1) { // Element node
        // Remove style attributes
        if (node.hasAttribute && node.hasAttribute('style')) {
          node.removeAttribute('style');
        }
        
        // Process children
        const childNodes = Array.from(node.childNodes || []);
        childNodes.forEach(child => processNode(child));
      }
    };
    
    // Process all children of body to remove styles
    const bodyChildren = Array.from(body.childNodes || []);
    bodyChildren.forEach(child => processNode(child));
    
    // Get the processed HTML from inside the body
    const bodyContent = body.toString().replace(/<body[^>]*>|<\/body>/g, '');
    
    if (!bodyContent || bodyContent.trim() === '') {
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
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input for styling');
      return '';
    }
    
    // Create a properly structured document for manipulation
    const parser = new DOMParser();
    const wrappedHTML = `<!DOCTYPE html><html><body>${htmlString}</body></html>`;
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    const body = doc.getElementsByTagName('body')[0];
    if (!body) {
      console.error('No body element found for styling');
      return '';
    }
    
    // Recursive function to add styles
    const addStyles = (node) => {
      if (!node || node.nodeType !== 1) return; // Only process element nodes
      
      const tagName = node.tagName?.toLowerCase();
      
      // Handle special cases for embed and iframe
      if (tagName === 'embed' || tagName === 'iframe') {
        // Preserve these elements but wrap in a responsive container
        const parent = node.parentNode;
        if (parent) {
          // Add responsive wrapper class
          parent.setAttribute('class', 'responsive-embed mb-6');
        }
      }
      // Apply classes based on tag name
      else if (tagName === 'h1') {
        node.setAttribute('class', 'text-4xl font-bold mb-6 font-montserrat');
      } else if (tagName === 'h2') {
        node.setAttribute('class', 'text-3xl font-semibold mb-4 mt-8 font-montserrat');
      } else if (tagName === 'h3') {
        node.setAttribute('class', 'text-2xl font-semibold mb-4 mt-6 font-montserrat');
      } else if (tagName === 'h4') {
        node.setAttribute('class', 'text-xl font-semibold mb-3 mt-6 font-montserrat');
      } else if (tagName === 'p') {
        // Look for indentation in the original style
        if (node.toString().includes('padding-left: 30px')) {
          node.setAttribute('class', 'mb-4 leading-relaxed pl-8');
        } else if (node.toString().includes('padding-left: 60px')) {
          node.setAttribute('class', 'mb-4 leading-relaxed pl-16');
        } else {
          node.setAttribute('class', 'mb-4 leading-relaxed');
        }
      } else if (tagName === 'center') {
        node.setAttribute('class', 'flex justify-center mb-6');
      } else if (tagName === 'ul') {
        node.setAttribute('class', 'list-disc pl-8 mb-6 space-y-2');
      } else if (tagName === 'ol') {
        node.setAttribute('class', 'list-decimal pl-8 mb-6 space-y-2');
      } else if (tagName === 'li') {
        node.setAttribute('class', 'mb-1');
      } else if (tagName === 'strong' || tagName === 'b') {
        node.setAttribute('class', 'font-semibold');
      } else if (tagName === 'em' || tagName === 'i') {
        node.setAttribute('class', 'italic');
      } else if (tagName === 'table') {
        node.setAttribute('class', 'w-full border-collapse mb-8');
      } else if (tagName === 'td') {
        node.setAttribute('class', 'border px-4 py-2');
      } else if (tagName === 'th') {
        node.setAttribute('class', 'border px-4 py-2 bg-gray-50 font-semibold');
      }
      
      // Process children recursively
      const childNodes = Array.from(node.childNodes || []);
      childNodes.forEach(child => addStyles(child));
    };
    
    // Process all children of body to add styles
    const bodyChildren = Array.from(body.childNodes || []);
    bodyChildren.forEach(child => addStyles(child));
    
    // Get the styled HTML from inside the body
    const styledContent = body.toString().replace(/<body[^>]*>|<\/body>/g, '');
    
    if (!styledContent || styledContent.trim() === '') {
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

export const debugHTMLStructure = (htmlString: string): string => {
  try {
    if (!htmlString || htmlString.trim() === '') {
      return 'Empty HTML input';
    }
    
    const parser = new DOMParser();
    const wrappedHTML = `<!DOCTYPE html><html><body>${htmlString}</body></html>`;
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    // Simple function to get element structure
    const getStructure = (element: Element, depth = 0): string => {
      if (!element) return '';
      
      const indent = ' '.repeat(depth * 2);
      let result = `${indent}<${element.tagName}`;
      
      // Add attributes info
      if (element.attributes && element.attributes.length > 0) {
        result += ' attributes: [';
        for (let i = 0; i < element.attributes.length; i++) {
          if (element.attributes[i]) {
            result += `${element.attributes[i].name}`;
            if (i < element.attributes.length - 1) result += ', ';
          }
        }
        result += ']';
      }
      
      result += '>\n';
      
      // Process children
      if (element.childNodes) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (child && child.nodeType === 1) { // Element node
            result += getStructure(child as Element, depth + 1);
          } else if (child && child.nodeType === 3) { // Text node
            const text = child.nodeValue?.trim();
            if (text && text.length > 0) {
              result += `${indent}  "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"\n`;
            }
          }
        }
      }
      
      return result;
    };
    
    // Get the body content structure
    const body = doc.getElementsByTagName('body')[0];
    if (!body) {
      return 'No content found';
    }
    
    // Build structure for all immediate children of body
    let result = '';
    for (let i = 0; i < body.childNodes.length; i++) {
      const child = body.childNodes[i];
      if (child && child.nodeType === 1) {
        result += getStructure(child as Element);
      }
    }
    
    return result || 'No elements found';
  } catch (error) {
    return `Error debugging HTML: ${error}`;
  }
};
