
import { DOMParser } from '@xmldom/xmldom';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input');
      return '';
    }
    
    // Use a wrapper to ensure proper parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML document');
      return '';
    }
    
    // Function to clean an element of all attributes except specific ones to keep
    const cleanElement = (element: Element) => {
      const attributesToKeep = ['src', 'width', 'height', 'type']; // Keep essential attributes for embeds
      
      // Get all attribute names
      const attributes = element.attributes;
      const attributesToRemove = [];
      
      // First collect attributes to remove
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (!attributesToKeep.includes(attr.name)) {
          attributesToRemove.push(attr.name);
        }
      }
      
      // Then remove them
      attributesToRemove.forEach(attrName => {
        element.removeAttribute(attrName);
      });
      
      // Clean child elements recursively
      const children = element.childNodes;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.nodeType === 1) { // Element node
          cleanElement(child as Element);
        }
      }
    };
    
    // Clean all elements
    const allElements = doc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      cleanElement(allElements[i]);
    }
    
    // Get the processed content - we need to extract from the wrapper div
    const wrapperDiv = doc.documentElement.getElementsByTagName('div')[0];
    const result = wrapperDiv ? wrapperDiv.innerHTML : '';
    
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
    
    // Use a wrapper to ensure proper parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
    
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
    
    // Apply styles to elements
    Object.entries(elementStyles).forEach(([tag, className]) => {
      const elements = doc.getElementsByTagName(tag);
      for (let i = 0; i < elements.length; i++) {
        elements[i].setAttribute('class', className);
      }
    });
    
    // Get the styled content - extracting from the wrapper div
    const wrapperDiv = doc.documentElement.getElementsByTagName('div')[0];
    const result = wrapperDiv ? wrapperDiv.innerHTML : '';
    
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
