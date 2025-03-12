
import { DOMParser } from '@xmldom/xmldom';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input');
      return '';
    }
    
    // Create a proper HTML document structure
    const wrappedHTML = `<!DOCTYPE html><html><body><div class="root-wrapper">${htmlString}</div></body></html>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    if (!doc || !doc.documentElement) {
      console.error('Failed to parse HTML document');
      return '';
    }
    
    // Function to clean an element of all attributes except specific ones to keep
    const cleanElement = (element: Element) => {
      if (!element || !element.attributes) return;
      
      const attributesToKeep = ['src', 'width', 'height', 'type']; // Keep essential attributes for embeds
      const attributes = Array.from(element.attributes || []);
      
      // Remove all attributes except those we want to keep
      attributes.forEach(attr => {
        if (attr && attr.name && !attributesToKeep.includes(attr.name)) {
          element.removeAttribute(attr.name);
        }
      });
      
      // Clean child elements recursively
      if (element.childNodes) {
        const children = Array.from(element.childNodes);
        children.forEach(child => {
          if (child && child.nodeType === 1) { // Element node
            cleanElement(child as Element);
          }
        });
      }
    };
    
    // Find the wrapper div using DOM traversal instead of getElementsByClassName
    let rootWrapperDiv: Element | null = null;
    const findWrapperDiv = (element: Element): void => {
      if (!element) return;
      
      // Check if current element is the wrapper
      if (element.attributes && element.getAttribute('class') === 'root-wrapper') {
        rootWrapperDiv = element;
        return;
      }
      
      // Check children
      if (element.childNodes) {
        const children = Array.from(element.childNodes);
        children.forEach(child => {
          if (child && child.nodeType === 1 && !rootWrapperDiv) { // Element node
            findWrapperDiv(child as Element);
          }
        });
      }
    };
    
    // Start search from document element
    findWrapperDiv(doc.documentElement);
    
    if (!rootWrapperDiv) {
      console.error('Could not find root wrapper element');
      return '';
    }
    
    // Clean all elements inside the wrapper
    if (rootWrapperDiv.childNodes) {
      const children = Array.from(rootWrapperDiv.childNodes);
      children.forEach(child => {
        if (child && child.nodeType === 1) { // Element node
          cleanElement(child as Element);
        }
      });
    }
    
    // Get the processed content
    const result = rootWrapperDiv.innerHTML || '';
    
    console.log('HTML processed successfully. Result length:', result.length);
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
    
    console.log('Styling HTML input, length:', htmlString.length);
    
    // Create a proper HTML document structure
    const wrappedHTML = `<!DOCTYPE html><html><body><div class="root-wrapper">${htmlString}</div></body></html>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    if (!doc || !doc.documentElement) {
      console.error('Failed to parse HTML for styling');
      return '';
    }
    
    // Add classes for styling
    const elementStyles: { [key: string]: string } = {
      'h1': 'text-4xl font-bold mb-6 font-montserrat',
      'h2': 'text-2xl font-semibold mb-4 mt-8 font-montserrat',
      'p': 'mb-4 leading-relaxed',
      'table': 'w-full border-collapse mb-8',
      'td': 'border px-4 py-2',
      'th': 'border px-4 py-2 bg-gray-50 font-semibold',
      'center': 'flex justify-center mb-6',
      'embed': 'max-w-full'
    };
    
    // Find the wrapper div using DOM traversal instead of getElementsByClassName
    let rootWrapperDiv: Element | null = null;
    const findWrapperDiv = (element: Element): void => {
      if (!element) return;
      
      // Check if current element is the wrapper
      if (element.attributes && element.getAttribute('class') === 'root-wrapper') {
        rootWrapperDiv = element;
        return;
      }
      
      // Check children
      if (element.childNodes) {
        const children = Array.from(element.childNodes);
        children.forEach(child => {
          if (child && child.nodeType === 1 && !rootWrapperDiv) { // Element node
            findWrapperDiv(child as Element);
          }
        });
      }
    };
    
    // Start search from document element
    findWrapperDiv(doc.documentElement);
    
    if (!rootWrapperDiv) {
      console.error('Could not find root wrapper element for styling');
      return '';
    }
    
    // Apply styles to elements
    Object.entries(elementStyles).forEach(([tag, className]) => {
      // Use getElementsByTagName directly on the found wrapper div
      const elements = Array.from(doc.getElementsByTagName(tag) || []);
      elements.forEach(element => {
        if (element && rootWrapperDiv?.contains(element)) {
          element.setAttribute('class', className);
        }
      });
    });
    
    // Get the styled content
    const result = rootWrapperDiv.innerHTML || '';
    
    console.log('HTML styled successfully. Result length:', result.length);
    return result;
  } catch (error) {
    console.error('Error in generateStyledHTML:', error);
    throw error;
  }
};

// Utility function to help with debugging
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
