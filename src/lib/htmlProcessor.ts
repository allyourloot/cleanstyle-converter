import { DOMParser } from '@xmldom/xmldom';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input');
      return '';
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    if (!doc || !doc.documentElement) {
      console.error('Failed to parse HTML document');
      return '';
    }
    
    // Function to clean an element
    const cleanElement = (element: Element) => {
      if (!element || !element.attributes) return;
      
      // Remove style attribute
      if (element.hasAttribute('style')) {
        element.removeAttribute('style');
      }
      
      // Process child elements
      const children = Array.from(element.childNodes || []);
      children.forEach(child => {
        if (child.nodeType === 1) { // Element node
          cleanElement(child as Element);
        }
      });
    };
    
    // Clean the document starting from the root
    const body = doc.documentElement.getElementsByTagName('body')[0];
    if (body && body.childNodes) {
      Array.from(body.childNodes).forEach(child => {
        if (child.nodeType === 1) {
          cleanElement(child as Element);
        }
      });
    }
    
    // Get the processed content
    const result = body ? body.innerHTML : '';
    
    if (!result || result.trim() === '') {
      console.error('Processing resulted in empty content');
      return '';
    }
    
    console.log('HTML processed successfully. Result:', result);
    return result;
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
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    if (!doc || !doc.documentElement) {
      console.error('Failed to parse HTML for styling');
      return '';
    }
    
    // Simple styling function
    const addStyles = (element: Element) => {
      if (!element || !element.tagName) return;
      
      const tagName = element.tagName.toLowerCase();
      switch (tagName) {
        case 'h1':
          element.setAttribute('class', 'text-4xl font-bold mb-6 font-montserrat');
          break;
        case 'h2':
          element.setAttribute('class', 'text-2xl font-semibold mb-4 mt-8 font-montserrat');
          break;
        case 'p':
          element.setAttribute('class', 'mb-4 leading-relaxed');
          break;
        case 'table':
          element.setAttribute('class', 'w-full border-collapse mb-8');
          break;
        case 'td':
          element.setAttribute('class', 'border px-4 py-2');
          break;
        case 'th':
          element.setAttribute('class', 'border px-4 py-2 bg-gray-50 font-semibold');
          break;
      }
      
      // Process children
      const children = Array.from(element.childNodes || []);
      children.forEach(child => {
        if (child.nodeType === 1) {
          addStyles(child as Element);
        }
      });
    };
    
    // Style the document
    const body = doc.documentElement.getElementsByTagName('body')[0];
    if (body && body.childNodes) {
      Array.from(body.childNodes).forEach(child => {
        if (child.nodeType === 1) {
          addStyles(child as Element);
        }
      });
    }
    
    // Get the styled content
    const result = body ? body.innerHTML : '';
    
    if (!result || result.trim() === '') {
      console.error('Styling resulted in empty content');
      return '';
    }
    
    console.log('HTML styled successfully. Result:', result);
    return result;
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
    
    const wrappedHTML = `<!DOCTYPE html><html><body>${htmlString}</body></html>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    if (!doc || !doc.documentElement) {
      return 'Failed to parse HTML document';
    }
    
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
    
    // Start from body to skip doctype and html elements
    const bodyElement = doc.getElementsByTagName('body')[0];
    return bodyElement ? getStructure(bodyElement.childNodes[0] as Element) : 'No content found';
  } catch (error) {
    return `Error debugging HTML: ${error}`;
  }
};

