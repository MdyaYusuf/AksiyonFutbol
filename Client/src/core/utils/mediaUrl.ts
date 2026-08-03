/**
 * Resolves API-relative media paths (e.g. /images/...) for the current host.
 * Absolute http(s) URLs are returned unchanged.
 */
export const resolveMediaUrl = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
};
