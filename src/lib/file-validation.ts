/**
 * File upload validation for security.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Magic bytes for image formats (first few bytes)
const SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF - need to check WEBP at offset 8
};

function matchesSignature(buffer: Buffer, sig: number[]): boolean {
  if (buffer.length < sig.length) return false;
  for (let i = 0; i < sig.length; i++) {
    if (buffer[i] !== sig[i]) return false;
  }
  return true;
}

function verifyImageSignature(buffer: Buffer, mimeType: string): boolean {
  const sigs = SIGNATURES[mimeType];
  if (!sigs) return false;
  for (const sig of sigs) {
    if (matchesSignature(buffer, sig)) {
      if (mimeType === 'image/webp' && buffer.length >= 12) {
        return buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
      }
      return true;
    }
  }
  return false;
}

export function validateImageUpload(file: File, buffer: Buffer): { valid: boolean; error?: string } {
  if (buffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: 'Fichier trop volumineux (max 5 Mo)' };
  }

  const mimeType = file.type?.toLowerCase();
  if (!mimeType || !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return { valid: false, error: 'Type de fichier non autorisé (JPEG, PNG, WebP, GIF uniquement)' };
  }

  if (!verifyImageSignature(buffer, mimeType)) {
    return { valid: false, error: 'Le contenu du fichier ne correspond pas à son type' };
  }

  return { valid: true };
}
