
import { DOMParser } from '@xmldom/xmldom';

export const createDOMParser = () => new DOMParser();

export const wrapHTML = (html: string) => `<!DOCTYPE html><html><body>${html}</body></html>`;

export const extractBodyContent = (body: Element): string => {
  if (!body) return '';
  return body.toString().replace(/<body[^>]*>|<\/body>/g, '');
};

export const isElementNode = (node: Node): boolean => node.nodeType === 1;

