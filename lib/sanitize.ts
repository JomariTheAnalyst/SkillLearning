import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 
      'strong', 'em', 'a', 'code', 'pre', 'blockquote', 'span', 'img'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'title'
    ],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORCE_BODY: true,
    SANITIZE_DOM: true,
    USE_PROFILES: { html: true }
  });
}

// Sanitize plain text (remove all HTML)
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

// Sanitize user input for database
export function sanitizeUserInput(input: string): string {
  // First remove all HTML
  const sanitized = sanitizeText(input);
  
  // Then escape special characters
  return escapeSpecialChars(sanitized);
}

// Escape special characters to prevent SQL injection and XSS
export function escapeSpecialChars(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\\/g, '\\\\')
    .replace(/\//g, '\\/')
    .replace(/\$/g, '\\$')
    .replace(/\^/g, '\\^');
}

// Sanitize object (recursively sanitize all string properties)
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const result = {} as T;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        // Sanitize string values
        (result as any)[key] = sanitizeUserInput(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        (result as any)[key] = sanitizeObject(value);
      } else {
        // Pass through non-string values
        (result as any)[key] = value;
      }
    }
  }
  
  return result;
} 