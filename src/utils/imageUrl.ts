// Prefixes image paths with the backend URL (for deployed environment)
// Locally, returns the path as-is (Vite serves them from public folder)

export function getImageUrl(imagePath: string): string {
  // If it's already a full URL (starts with http), return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Ensure the path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${apiUrl}${normalizedPath}`;
}