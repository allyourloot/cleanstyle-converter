
import { DOMParser } from '@xmldom/xmldom';

// Helper to check if text contains product specifications
const hasProductSpecifications = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes('product specifications') ||
    lowerText.includes('specifications') ||
    lowerText.includes('tech specs') ||
    lowerText.includes('technical specifications')
  );
};

// Convert a list to a table when it contains specifications
const convertSpecListToTable = (listElement: Element): HTMLTableElement => {
  const document = listElement.ownerDocument;
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  
  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const nameHeader = document.createElement('th');
  nameHeader.textContent = 'Specification';
  const valueHeader = document.createElement('th');
  valueHeader.textContent = 'Value';
  headerRow.appendChild(nameHeader);
  headerRow.appendChild(valueHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Process list items
  const items = listElement.getElementsByTagName('li');
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const text = item.textContent || '';
    
    // Try to split by common separators
    let parts = [];
    if (text.includes(':')) {
      parts = text.split(':', 2);
    } else if (text.includes('-')) {
      parts = text.split('-', 2);
    } else if (text.includes('–')) {
      parts = text.split('–', 2);
    } else {
      // If no separator found, use the whole text as the specification name
      parts = [text, ''];
    }
    
    const row = document.createElement('tr');
    
    const nameCell = document.createElement('td');
    nameCell.textContent = parts[0].trim();
    nameCell.setAttribute('data-label', 'Specification');
    
    const valueCell = document.createElement('td');
    valueCell.textContent = parts.length > 1 ? parts[1].trim() : '';
    valueCell.setAttribute('data-label', 'Value');
    
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
  }
  
  table.appendChild(tbody);
  return table;
};

export const processHTML = (htmlString: string): string => {
  try {
    console.log('processHTML input:', htmlString.substring(0, 100) + '...');
    
    // Create a DOM parser
    const parser = new DOMParser();
    
    // Wrap the HTML if it's not a complete document
    let wrappedHTML = htmlString;
    if (!htmlString.trim().toLowerCase().startsWith('<!doctype html') && 
        !htmlString.trim().toLowerCase().startsWith('<html')) {
      wrappedHTML = `<body>${htmlString}</body>`;
    }
    
    // Parse the HTML
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML document');
      return htmlString;
    }
    
    console.log('Document parsed successfully');
    
    // Remove all inline styles from all elements
    const allElements = doc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      if (element.removeAttribute) {
        element.removeAttribute('style');
        element.removeAttribute('class');
        element.removeAttribute('id');
        // Remove any other non-essential attributes
        const attributesToRemove = ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'width', 'height'];
        attributesToRemove.forEach(attr => {
          element.removeAttribute(attr);
        });
      }
    }
    
    // Find product specification sections and convert lists to tables
    let headings = doc.getElementsByTagName('h2');
    if (headings.length === 0) {
      headings = doc.getElementsByTagName('h1');
    }
    if (headings.length === 0) {
      headings = doc.getElementsByTagName('h3');
    }
    
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (heading.textContent && hasProductSpecifications(heading.textContent)) {
        // Look for the next list after this heading
        let nextElement = heading.nextSibling;
        while (nextElement) {
          if (nextElement.nodeName && 
              (nextElement.nodeName.toLowerCase() === 'ul' || 
               nextElement.nodeName.toLowerCase() === 'ol')) {
            // Found a list, convert it to a table
            const table = convertSpecListToTable(nextElement as Element);
            if (nextElement.parentNode) {
              nextElement.parentNode.replaceChild(table, nextElement);
            }
            break;
          }
          nextElement = nextElement.nextSibling;
        }
      }
    }
    
    // Look for specification lists that might not have headings
    const lists = doc.getElementsByTagName('ul');
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i];
      const prevElement = list.previousSibling;
      
      // Check if it's likely a specification list
      let isSpecList = false;
      
      // Check if previous element contains spec-related text
      if (prevElement && prevElement.textContent && hasProductSpecifications(prevElement.textContent)) {
        isSpecList = true;
      }
      
      // Otherwise check the list items for common spec patterns
      if (!isSpecList) {
        const items = list.getElementsByTagName('li');
        let specPatternCount = 0;
        
        for (let j = 0; j < items.length; j++) {
          const text = items[j].textContent || '';
          if (text.includes(':') || text.includes(' - ') || text.match(/^[\w\s]+ \d+/)) {
            specPatternCount++;
          }
        }
        
        // If more than half the items follow a spec pattern, consider it a spec list
        isSpecList = items.length > 0 && (specPatternCount / items.length) > 0.5;
      }
      
      if (isSpecList) {
        const table = convertSpecListToTable(list);
        if (list.parentNode) {
          list.parentNode.replaceChild(table, list);
          i--; // Adjust for the removed element
        }
      }
    }
    
    // Get the body content
    const bodyContent = doc.getElementsByTagName('body')[0];
    
    if (!bodyContent) {
      console.error('No body element found in the document');
      return htmlString;
    }
    
    console.log('processHTML output length:', bodyContent.innerHTML.length);
    return bodyContent.innerHTML;
  } catch (error) {
    console.error('Error processing HTML:', error);
    return htmlString; // Return original if error
  }
};

// Generate HTML with applied styling classes
export const generateStyledHTML = (htmlString: string): string => {
  try {
    console.log('generateStyledHTML input length:', htmlString.length);
    
    if (!htmlString || htmlString.trim() === '') {
      console.error('Empty HTML input for styling');
      return '';
    }
    
    // Create a DOM parser
    const parser = new DOMParser();
    
    // Wrap the HTML in a body tag if it doesn't have one
    let wrappedHTML = htmlString;
    if (!htmlString.trim().toLowerCase().startsWith('<!doctype html') && 
        !htmlString.trim().toLowerCase().startsWith('<html')) {
      wrappedHTML = `<body>${htmlString}</body>`;
    }
    
    // Parse the HTML
    const doc = parser.parseFromString(wrappedHTML, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML document for styling');
      return htmlString;
    }
    
    // Apply class to the root to get our CSS styling
    const body = doc.getElementsByTagName('body')[0];
    if (!body) {
      console.error('No body element found in the document for styling');
      return htmlString;
    }
    
    body.setAttribute('class', 'html-preview');
    
    // Process existing tables to ensure they have data-label attributes
    const tables = doc.getElementsByTagName('table');
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      table.setAttribute('class', 'specifications-table');
      
      // Get header cells - from thead if exists, otherwise first row
      let headerCells: HTMLCollectionOf<Element> | Element[] = [];
      const thead = table.getElementsByTagName('thead')[0];
      if (thead) {
        headerCells = thead.getElementsByTagName('th');
      } else {
        const firstRow = table.getElementsByTagName('tr')[0];
        if (firstRow) {
          headerCells = firstRow.getElementsByTagName('th').length > 0 ? 
                      firstRow.getElementsByTagName('th') : 
                      firstRow.getElementsByTagName('td');
        }
      }
      
      // Extract header texts
      const headerTexts: string[] = [];
      for (let j = 0; j < headerCells.length; j++) {
        headerTexts.push(headerCells[j].textContent || `Column ${j+1}`);
      }
      
      // If no header row was found, create default header texts
      if (headerTexts.length === 0 && table.getElementsByTagName('tr').length > 0) {
        const firstRowCells = table.getElementsByTagName('tr')[0].getElementsByTagName('td');
        for (let j = 0; j < firstRowCells.length; j++) {
          headerTexts.push(`Column ${j+1}`);
        }
      }
      
      // Apply data-label to each cell in data rows
      const rows = table.getElementsByTagName('tr');
      const startRow = thead ? 0 : 1; // Skip first row if no thead and first row used as header
      
      for (let j = startRow; j < rows.length; j++) {
        const cells = rows[j].getElementsByTagName('td');
        for (let k = 0; k < cells.length; k++) {
          if (k < headerTexts.length) {
            cells[k].setAttribute('data-label', headerTexts[k]);
          }
        }
      }
    }
    
    // Enhance paragraphs for better styling
    const paragraphs = doc.getElementsByTagName('p');
    for (let i = 0; i < paragraphs.length; i++) {
      // Check if paragraph is indented or has specific formatting
      const content = paragraphs[i].textContent || '';
      if (content.trim().startsWith('-') || content.trim().startsWith('•')) {
        paragraphs[i].setAttribute('class', 'feature-list-item');
      }
    }
    
    // Enhance headings
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i] as Element;
      const level = heading.nodeName.toLowerCase().substring(1);
      heading.setAttribute('class', `heading-${level}`);
    }
    
    // Get the content
    const content = body.innerHTML;
    console.log('generateStyledHTML output length:', content.length);
    return content;
  } catch (error) {
    console.error('Error generating styled HTML:', error);
    return htmlString; // Return original if error
  }
};
