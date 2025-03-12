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
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Remove all inline styles from all elements
    const allElements = doc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      element.removeAttribute('style');
      element.removeAttribute('class');
      element.removeAttribute('id');
      // Remove any other non-essential attributes
      const attributesToRemove = ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'width', 'height'];
      attributesToRemove.forEach(attr => {
        element.removeAttribute(attr);
      });
    }
    
    // Find product specification sections and convert lists to tables
    const headings = doc.getElementsByTagName('h1');
    headings.length === 0 && doc.getElementsByTagName('h2');
    headings.length === 0 && doc.getElementsByTagName('h3');
    
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (hasProductSpecifications(heading.textContent || '')) {
        // Look for the next list after this heading
        let nextElement = heading.nextSibling;
        while (nextElement) {
          if (nextElement.nodeName.toLowerCase() === 'ul' || nextElement.nodeName.toLowerCase() === 'ol') {
            // Found a list, convert it to a table
            const table = convertSpecListToTable(nextElement as Element);
            heading.parentNode?.replaceChild(table, nextElement);
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
        isSpecList = (specPatternCount / items.length) > 0.5;
      }
      
      if (isSpecList) {
        const table = convertSpecListToTable(list);
        list.parentNode?.replaceChild(table, list);
        i--; // Adjust for the removed element
      }
    }
    
    // Return the processed HTML
    return doc.documentElement.outerHTML;
  } catch (error) {
    console.error('Error processing HTML:', error);
    return htmlString; // Return original if error
  }
};

// Generate HTML with applied styling classes
export const generateStyledHTML = (htmlString: string): string => {
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Apply class to the root to get our CSS styling
    const body = doc.getElementsByTagName('body')[0];
    if (body) {
      body.setAttribute('class', 'html-preview');
    }
    
    // Ensure tables have data-label attributes for responsive design
    const tables = doc.getElementsByTagName('table');
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const headers = table.getElementsByTagName('th');
      const rows = table.getElementsByTagName('tr');
      
      // Get header texts
      const headerTexts: string[] = [];
      for (let j = 0; j < headers.length; j++) {
        headerTexts.push(headers[j].textContent || `Column ${j+1}`);
      }
      
      // Apply data-label to each cell
      for (let j = 1; j < rows.length; j++) { // Skip header row
        const cells = rows[j].getElementsByTagName('td');
        for (let k = 0; k < cells.length; k++) {
          if (k < headerTexts.length) {
            cells[k].setAttribute('data-label', headerTexts[k]);
          }
        }
      }
    }
    
    return body ? body.innerHTML : htmlString;
  } catch (error) {
    console.error('Error generating styled HTML:', error);
    return htmlString; // Return original if error
  }
};
