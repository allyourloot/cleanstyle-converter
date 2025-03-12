import { DOMParser } from '@xmldom/xmldom';

export const processHTML = (htmlString: string): string => {
  try {
    console.log('Processing HTML input:', htmlString.slice(0, 100) + '...');
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input');
      return '';
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${htmlString}</body>`, 'text/html');
    
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
    
    // Get the processed content
    const bodyContent = doc.getElementsByTagName('body')[0];
    const result = bodyContent ? bodyContent.innerHTML : '';
    
    console.log('HTML processed successfully');
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
    const doc = parser.parseFromString(`<body>${htmlString}</body>`, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML for styling');
      return '';
    }
    
    // Add classes for styling
    const elementStyles: { [key: string]: string } = {
      'body': 'html-preview',
      'h1': 'text-4xl font-bold mb-6 font-montserrat',
      'h2': 'text-2xl font-semibold mb-4 mt-8 font-montserrat',
      'p': 'mb-4 leading-relaxed',
      'table': 'w-full border-collapse mb-8',
      'td': 'border px-4 py-2',
      'th': 'border px-4 py-2 bg-gray-50 font-semibold',
      'center': 'flex justify-center mb-6'
    };
    
    // Apply styles to elements
    Object.entries(elementStyles).forEach(([tag, className]) => {
      const elements = doc.getElementsByTagName(tag);
      for (let i = 0; i < elements.length; i++) {
        elements[i].setAttribute('class', className);
      }
    });
    
    // Special handling for embedded content
    const embeds = doc.getElementsByTagName('embed');
    for (let i = 0; i < embeds.length; i++) {
      const embed = embeds[i];
      // Preserve essential attributes for embeds
      const src = embed.getAttribute('src');
      const width = embed.getAttribute('width');
      const height = embed.getAttribute('height');
      embed.setAttribute('class', 'max-w-full');
      if (src) embed.setAttribute('src', src);
      if (width) embed.setAttribute('width', width);
      if (height) embed.setAttribute('height', height);
    }
    
    // Get the styled content
    const bodyContent = doc.getElementsByTagName('body')[0];
    const result = bodyContent ? bodyContent.innerHTML : '';
    
    console.log('HTML styled successfully');
    return result;
  } catch (error) {
    console.error('Error in generateStyledHTML:', error);
    throw error;
  }
};
