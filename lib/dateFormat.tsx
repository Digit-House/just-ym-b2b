import { parseISO, format } from "date-fns";

/**
 * Convert UTC ISO string to formatted local date
 */
export const formatUtcDate = (
  utcString: string,
  pattern: string = "dd MMM yyyy, HH:mm"
): string => {
  if (!utcString) return "";

  try {
    const date = parseISO(utcString);
    return format(date, pattern);
  } catch (err) {
    console.error("Invalid date:", utcString);
    return "";
  }
};
