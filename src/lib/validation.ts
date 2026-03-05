/**
 * Input validation and sanitization utilities for security.
 */

const MAX_JSON_BODY = 100 * 1024; // 100 KB for public API requests

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AUTHOR_LENGTH = 100;
const MAX_CONTENT_LENGTH = 2000;
const MAX_EMAIL_LENGTH = 254;
const MAX_SLUG_LENGTH = 100;

/** Remove potential XSS characters from text */
export function sanitizeText(input: string, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .replace(/\s+/g, ' '); // Normalize whitespace
}

export function validateSlug(slug: unknown): string | null {
  if (typeof slug !== 'string') return null;
  const trimmed = slug.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > MAX_SLUG_LENGTH) return null;
  if (!SLUG_REGEX.test(trimmed)) return null;
  return trimmed;
}

export function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LENGTH) return null;
  if (!EMAIL_REGEX.test(trimmed)) return null;
  return trimmed;
}

export function validateCommentAuthor(author: unknown): string | null {
  if (typeof author !== 'string') return null;
  const sanitized = sanitizeText(author, MAX_AUTHOR_LENGTH);
  return sanitized.length > 0 ? sanitized : null;
}

export function validateCommentContent(content: unknown): string | null {
  if (typeof content !== 'string') return null;
  const sanitized = sanitizeText(content, MAX_CONTENT_LENGTH);
  return sanitized.length > 0 ? sanitized : null;
}

export function validateJsonBody<T>(body: unknown, validator: (b: unknown) => T | null): T | null {
  if (body === null || body === undefined) return null;
  return validator(body);
}

export function checkContentLength(request: Request, maxBytes = MAX_JSON_BODY): boolean {
  const length = request.headers.get('content-length');
  if (!length) return true; // No length header, let it through (body might be empty)
  const size = parseInt(length, 10);
  return !Number.isNaN(size) && size <= maxBytes;
}
