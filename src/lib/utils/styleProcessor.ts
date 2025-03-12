
export const applyElementStyles = (node: Element): void => {
  if (!node || node.nodeType !== 1) return;
  
  const tagName = node.tagName?.toLowerCase();
  
  switch (tagName) {
    case 'embed':
    case 'iframe':
      if (node.parentNode && node.parentNode.nodeType === 1) {
        (node.parentNode as Element).setAttribute('class', 'responsive-embed mb-6');
      }
      break;
    case 'h1':
      node.setAttribute('class', 'text-4xl font-bold mb-6 font-montserrat');
      break;
    case 'h2':
      node.setAttribute('class', 'text-3xl font-semibold mb-4 mt-8 font-montserrat');
      break;
    case 'h3':
      node.setAttribute('class', 'text-2xl font-semibold mb-4 mt-6 font-montserrat');
      break;
    case 'h4':
      node.setAttribute('class', 'text-xl font-semibold mb-3 mt-6 font-montserrat');
      break;
    case 'p':
      const hasIndentation = node.toString().includes('padding-left: 30px');
      const hasDoubleIndentation = node.toString().includes('padding-left: 60px');
      node.setAttribute('class', 
        hasDoubleIndentation ? 'mb-4 leading-relaxed pl-16' :
        hasIndentation ? 'mb-4 leading-relaxed pl-8' :
        'mb-4 leading-relaxed'
      );
      break;
    case 'center':
      node.setAttribute('class', 'flex justify-center mb-6');
      break;
    case 'ul':
      node.setAttribute('class', 'list-disc pl-8 mb-6 space-y-2');
      break;
    case 'ol':
      node.setAttribute('class', 'list-decimal pl-8 mb-6 space-y-2');
      break;
    case 'li':
      node.setAttribute('class', 'mb-1');
      break;
    case 'strong':
    case 'b':
      node.setAttribute('class', 'font-semibold');
      break;
    case 'em':
    case 'i':
      node.setAttribute('class', 'italic');
      break;
    case 'table':
      node.setAttribute('class', 'w-full border-collapse mb-8');
      break;
    case 'td':
      node.setAttribute('class', 'border px-4 py-2');
      break;
    case 'th':
      node.setAttribute('class', 'border px-4 py-2 bg-gray-50 font-semibold');
      break;
  }
};
