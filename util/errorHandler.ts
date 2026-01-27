// Error Status Storage Keys
const ERROR_STATUS_KEY = "error_status";
const ERROR_TIMESTAMP_KEY = "error_timestamp";
const ERROR_REDIRECTED_KEY = "error_redirected";

// Error types
export type ErrorType = "network" | "server" | "unknown";

// Error status object structure
export interface ErrorStatus {
  type: ErrorType;
  message: string;
  timestamp: number;
  from?: string;
}

/**
 * Store error status in localStorage
 */
export const setErrorStatus = (
  type: ErrorType,
  message: string,
  from?: string
): void => {
  try {
    const errorStatus: ErrorStatus = {
      type,
      message,
      timestamp: Date.now(),
      from,
    };

    localStorage.setItem(ERROR_STATUS_KEY, JSON.stringify(errorStatus));
    localStorage.setItem(ERROR_TIMESTAMP_KEY, Date.now().toString());
    // Remove the redirected flag when a new error occurs
    localStorage.removeItem(ERROR_REDIRECTED_KEY);
  } catch (err) {
    console.error("Failed to save error status to localStorage", err);
  }
};

/**
 * Retrieve error status from localStorage
 */
export const getErrorStatus = (): ErrorStatus | null => {
  try {
    const raw = localStorage.getItem(ERROR_STATUS_KEY);
    if (!raw) return null;

    const parsed: ErrorStatus = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error("Failed to parse error status from localStorage", err);
    return null;
  }
};

/**
 * Remove error status from localStorage
 */
export const removeErrorStatus = (): void => {
  try {
    localStorage.removeItem(ERROR_STATUS_KEY);
    localStorage.removeItem(ERROR_TIMESTAMP_KEY);
    localStorage.removeItem(ERROR_REDIRECTED_KEY);
  } catch (err) {
    console.error("Failed to remove error status from localStorage", err);
  }
};

/**
 * Check if we have already redirected due to an error (to prevent infinite loops)
 */
export const hasRedirectedForError = (): boolean => {
  try {
    return localStorage.getItem(ERROR_REDIRECTED_KEY) === "true";
  } catch (err) {
    console.error("Failed to check error redirect status", err);
    return false;
  }
};

/**
 * Mark that we have redirected due to an error
 */
export const setErrorRedirected = (): void => {
  try {
    localStorage.setItem(ERROR_REDIRECTED_KEY, "true");
  } catch (err) {
    console.error("Failed to set error redirected flag", err);
  }
};

/**
 * Check if error is recent (within 5 minutes)
 */
export const isRecentError = (minutes: number = 5): boolean => {
  try {
    const timestampStr = localStorage.getItem(ERROR_TIMESTAMP_KEY);
    if (!timestampStr) return false;

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const fiveMinutes = minutes * 60 * 1000;

    return now - timestamp < fiveMinutes;
  } catch (err) {
    console.error("Failed to check error timestamp", err);
    return false;
  }
};

/**
 * Check if we should redirect to error page
 */
export const shouldRedirectToErrorPage = (): boolean => {
  const errorStatus = getErrorStatus();
  const redirected = hasRedirectedForError();
  const recent = isRecentError();

  // Redirect if there's an error status, it's recent, and we haven't redirected yet
  return !!(errorStatus && recent && !redirected);
};