import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify to clean potentially dangerous HTML
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'span', 'div', 'a'
    ],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  });
};

/**
 * Creates a safe HTML object for React's dangerouslySetInnerHTML
 * Automatically sanitizes the content before creating the object
 */
export const createSafeHtml = (html: string) => {
  return { __html: sanitizeHtml(html) };
};

/**
 * Validates if a user role is valid and safe
 */
export const isValidUserRole = (role: string): boolean => {
  const validRoles = ['user', 'admin', 'superadmin', 'gerente', 'operador', 'consultor', 'cliente'];
  return validRoles.includes(role);
};

/**
 * Sanitizes user input by removing potentially dangerous characters
 */
export const sanitizeUserInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, '') // Remove dangerous characters
    .trim();
};