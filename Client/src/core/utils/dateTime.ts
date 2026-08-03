/**
 * Parses API DateTime values.
 * Timezone-less ISO strings are treated as UTC (server stores UTC; EF often omits Z).
 */
export const parseApiDate = (value: string | Date): Date => {
  if (value instanceof Date) {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return new Date(Number.NaN);
  }

  if (/([zZ]|[+-]\d{2}:\d{2})$/.test(trimmed)) {
    return new Date(trimmed);
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
    return new Date(`${trimmed}Z`);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00Z`);
  }

  return new Date(trimmed);
};
