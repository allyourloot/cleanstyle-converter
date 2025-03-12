
import { DOMParser } from '@xmldom/xmldom';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input');
      return '';
    }
    
    // Wrap the input in a container to ensure proper parsing
    const wrappedHTML = `<div>${htmlString}</div>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    // Function to clean an element
    const cleanElement = (element: Element): void => {
      if (!element) return;
      
      // Remove style attribute safely
      if (element.hasAttribute && element.hasAttribute('style')) {
        element.removeAttribute('style');
      }
      
      // Process child elements recursively
      const childNodes = element.childNodes || [];
      for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];
        if (child && child.nodeType === 1) { // Element node
          cleanElement(child as Element);
        }
      }
    };
    
    // Get the body or document element
    const body = doc.getElementsByTagName('body')[0] || doc.documentElement;
    
    if (!body) {
      console.error('No body element found');
      return '';
    }
    
    // Get the content (our wrapped div)
    const contentDiv = body.childNodes[0];
    
    if (!contentDiv) {
      console.error('No content found in the body');
      return '';
    }
    
    // Clean all elements starting from our content div
    cleanElement(contentDiv as Element);
    
    // Get the processed inner HTML
    const result = contentDiv.toString();
    
    // Extract just the inner content from our wrapper div
    const cleanedHTML = result.replace(/<div>|<\/div>/g, '').trim();
    
    if (!cleanedHTML || cleanedHTML.trim() === '') {
      console.error('Cleaning resulted in empty content');
      return '';
    }
    
    console.log('HTML processed successfully. Result:', cleanedHTML);
    return cleanedHTML;
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
    
    // Wrap the input in a container to ensure proper parsing
    const wrappedHTML = `<div>${htmlString}</div>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    // Simple styling function
    const addStyles = (element: Element): void => {
      if (!element || !element.tagName) return;
      
      const tagName = element.tagName.toLowerCase();
      
      // Apply classes based on tag name
      if (tagName === 'h1') {
        element.setAttribute('class', 'text-4xl font-bold mb-6 font-montserrat');
      } else if (tagName === 'h2') {
        element.setAttribute('class', 'text-2xl font-semibold mb-4 mt-8 font-montserrat');
      } else if (tagName === 'p') {
        element.setAttribute('class', 'mb-4 leading-relaxed');
      } else if (tagName === 'table') {
        element.setAttribute('class', 'w-full border-collapse mb-8');
      } else if (tagName === 'td') {
        element.setAttribute('class', 'border px-4 py-2');
      } else if (tagName === 'th') {
        element.setAttribute('class', 'border px-4 py-2 bg-gray-50 font-semibold');
      }
      
      // Process children recursively
      const childNodes = element.childNodes || [];
      for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];
        if (child && child.nodeType === 1) {
          addStyles(child as Element);
        }
      }
    };
    
    // Get the body or document element
    const body = doc.getElementsByTagName('body')[0] || doc.documentElement;
    
    if (!body) {
      console.error('No body element found for styling');
      return '';
    }
    
    // Get the content (our wrapped div)
    const contentDiv = body.childNodes[0];
    
    if (!contentDiv) {
      console.error('No content found in the body for styling');
      return '';
    }
    
    // Add styles to all elements starting from our content div
    addStyles(contentDiv as Element);
    
    // Get the styled inner HTML
    const result = contentDiv.toString();
    
    // Extract just the inner content from our wrapper div
    const styledHTML = result.replace(/<div>|<\/div>/g, '').trim();
    
    if (!styledHTML || styledHTML.trim() === '') {
      console.error('Styling resulted in empty content');
      return '';
    }
    
    console.log('HTML styled successfully. Result:', styledHTML);
    return styledHTML;
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
    
    const wrappedHTML = `<div>${htmlString}</div>`;
    const parser = new DOMParser();
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
    
    // Get the first element (inside our wrapper div)
    const body = doc.getElementsByTagName('body')[0] || doc.documentElement;
    if (!body || !body.childNodes || body.childNodes.length === 0) {
      return 'No content found';
    }
    
    const contentDiv = body.childNodes[0];
    if (!contentDiv || !contentDiv.childNodes || contentDiv.childNodes.length === 0) {
      return 'No elements found inside wrapper';
    }
    
    // Get the first actual content element
    const firstElement = contentDiv.childNodes[0];
    
    return firstElement ? getStructure(firstElement as Element) : 'No elements found';
  } catch (error) {
    return `Error debugging HTML: ${error}`;
  }
};
