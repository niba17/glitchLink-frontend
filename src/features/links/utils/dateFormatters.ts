import { format, parseISO, isValid } from "date-fns";

/**
 * Normalizes a local date string from the input field to a UTC string.
 * This function takes a date string from the input field (e.g., '2025-10-01T01:01')
 * that is in the user's local timezone and converts it to a standard
 * string to be sent to the backend.
 *
 * @param dateString The date string from the input field (e.g., '2025-10-01T01:01').
 * @returns The normalized UTC date string in 'YYYY-MM-DD HH:mm' format, or null.
 */
export const normalizeExpiresAt = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;

  const localDate = parseISO(dateString);
  if (!isValid(localDate)) return null;

  return format(localDate, "yyyy-MM-dd HH:mm");
};

/**
 * Formats a UTC date string from the backend for display in a local input field.
 * This function converts a UTC date string from the server into a format
 * that is suitable for display in a datetime-local input, adjusting
 * it to the user's local timezone.
 *
 * @param utcString The UTC date string from the API (e.g., '2025-09-30T18:01:00.000Z').
 * @returns The formatted local date string for the input field, or null.
 */
export const formatForInput = (utcString: string | null): string | null => {
  if (!utcString) {
    return null;
  }

  // Parse the UTC date string from the backend.
  const date = parseISO(utcString);

  if (!isValid(date)) {
    return null;
  }

  // Return the date formatted for a local datetime-local input field.
  // This will correctly display the time in the user's timezone.
  // Example: "2025-10-01T01:01"
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

export const formatForDisplay = (dateString: string | null): string => {
  if (!dateString) return "not setted";

  const parsed = parseISO(dateString);
  if (!isValid(parsed)) return dateString;

  return format(parsed, "yyyy-MM-dd hh:mm a");
};
