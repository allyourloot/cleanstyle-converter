import { DOMParser } from '@xmldom/xmldom';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input');
      return '';
    }
    
    // Wrap content in a root div with a doctype to satisfy xmldom requirements
    const wrappedHTML = `<!DOCTYPE html><div class="root-wrapper">${htmlString}</div>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML document');
      return '';
    }
    
    // Function to clean an element of all attributes except specific ones to keep
    const cleanElement = (element: Element) => {
      const attributesToKeep = ['src', 'width', 'height', 'type']; // Keep essential attributes for embeds
      const attributes = Array.from(element.attributes);
      
      // Remove all attributes except those we want to keep
      attributes.forEach(attr => {
        if (!attributesToKeep.includes(attr.name)) {
          element.removeAttribute(attr.name);
        }
      });
      
      // Clean child elements recursively
      const children = Array.from(element.childNodes);
      children.forEach(child => {
        if (child.nodeType === 1) { // Element node
          cleanElement(child as Element);
        }
      });
    };
    
    // Get the root wrapper and clean all its children
    const rootWrapper = doc.documentElement.getElementsByClassName('root-wrapper')[0];
    if (!rootWrapper) {
      console.error('Could not find root wrapper element');
      return '';
    }
    
    Array.from(rootWrapper.getElementsByTagName('*')).forEach(cleanElement);
    
    // Get the processed content from inside the wrapper
    const result = rootWrapper.innerHTML;
    console.log('HTML processed successfully. Result length:', result.length);
    
    if (!result || result.trim() === '') {
      console.error('processHTML returned empty content despite successful processing');
    }
    
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
    
    // Wrap with doctype for proper parsing
    const wrappedHTML = `<!DOCTYPE html><div class="root-wrapper">${htmlString}</div>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    if (!doc) {
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
    
    // Get the root wrapper
    const rootWrapper = doc.documentElement.getElementsByClassName('root-wrapper')[0];
    if (!rootWrapper) {
      console.error('Could not find root wrapper element for styling');
      return '';
    }
    
    // Apply styles to elements
    Object.entries(elementStyles).forEach(([tag, className]) => {
      const elements = rootWrapper.getElementsByTagName(tag);
      Array.from(elements).forEach(element => {
        element.setAttribute('class', className);
      });
    });
    
    // Get the styled content from inside the wrapper
    const result = rootWrapper.innerHTML;
    console.log('HTML styled successfully. Result length:', result.length);
    
    if (!result || result.trim() === '') {
      console.error('generateStyledHTML returned empty content despite successful processing');
    }
    
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
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    if (!doc) {
      return 'Failed to parse HTML document';
    }
    
    // Simple function to get element structure
    const getStructure = (element: Element, depth = 0): string => {
      const indent = ' '.repeat(depth * 2);
      let result = `${indent}<${element.tagName}`;
      
      // Add attributes info
      if (element.attributes.length > 0) {
        result += ' attributes: [';
        for (let i = 0; i < element.attributes.length; i++) {
          result += `${element.attributes[i].name}`;
          if (i < element.attributes.length - 1) result += ', ';
        }
        result += ']';
      }
      
      result += '>\n';
      
      // Process children
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === 1) { // Element node
          result += getStructure(child as Element, depth + 1);
        } else if (child.nodeType === 3) { // Text node
          const text = child.nodeValue?.trim();
          if (text && text.length > 0) {
            result += `${indent}  "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"\n`;
          }
        }
      }
      
      return result;
    };
    
    return getStructure(doc.documentElement);
  } catch (error) {
    return `Error debugging HTML: ${error}`;
  }
};
