
export const debugHTMLStructure = (htmlString: string): string => {
  try {
    if (!htmlString?.trim()) return 'Empty HTML input';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<!DOCTYPE html><html><body>${htmlString}</body></html>`,
      'text/html'
    );
    
    const getStructure = (element: Element, depth = 0): string => {
      if (!element) return '';
      
      const indent = ' '.repeat(depth * 2);
      let result = `${indent}<${element.tagName}`;
      
      if (element.attributes?.length > 0) {
        result += ' attributes: [';
        for (let i = 0; i < element.attributes.length; i++) {
          if (element.attributes[i]) {
            result += element.attributes[i].name;
            if (i < element.attributes.length - 1) result += ', ';
          }
        }
        result += ']';
      }
      
      result += '>\n';
      
      if (element.childNodes) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (child.nodeType === 1) {
            result += getStructure(child as Element, depth + 1);
          } else if (child.nodeType === 3) {
            const text = child.nodeValue?.trim();
            if (text) {
              result += `${indent}  "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"\n`;
            }
          }
        }
      }
      
      return result;
    };
    
    const body = doc.getElementsByTagName('body')[0];
    if (!body) return 'No content found';
    
    let result = '';
    for (let i = 0; i < body.childNodes.length; i++) {
      const child = body.childNodes[i];
      if (child.nodeType === 1) {
        result += getStructure(child as Element);
      }
    }
    
    return result || 'No elements found';
  } catch (error) {
    return `Error debugging HTML: ${error}`;
  }
};

