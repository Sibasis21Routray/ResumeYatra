/**
 * Utility functions for date parsing and calculations
 */

/**
 * Parses various date string formats into a Date object
 * Supports formats like:
 * - "Jan 2020"
 * - "01/2020"
 * - "2020"
 * - "January 2020"
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;

  const trimmed = dateStr.trim();

  // Try different formats
  const formats = [
    // MM/YYYY
    /^(\d{1,2})\/(\d{4})$/,
    // Month YYYY (e.g., "Jan 2020", "January 2020")
    /^([A-Za-z]+)\s+(\d{4})$/,
    // YYYY only
    /^(\d{4})$/,
  ];

  for (const format of formats) {
    const match = trimmed.match(format);
    if (match) {
      if (format === formats[0]) {
        // MM/YYYY
        const month = parseInt(match[1]) - 1; // JS months are 0-based
        const year = parseInt(match[2]);
        return new Date(year, month);
      } else if (format === formats[1]) {
        // Month YYYY
        const monthName = match[1];
        const year = parseInt(match[2]);
        const monthIndex = getMonthIndex(monthName);
        if (monthIndex !== -1) {
          return new Date(year, monthIndex);
        }
      } else if (format === formats[2]) {
        // YYYY
        const year = parseInt(match[1]);
        return new Date(year, 0); // January of that year
      }
    }
  }

  return null;
}

/**
 * Gets month index from month name (0-11)
 */
function getMonthIndex(monthName: string): number {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const shortMonths = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const lowerName = monthName.toLowerCase();

  let index = months.indexOf(lowerName);
  if (index === -1) {
    index = shortMonths.indexOf(lowerName);
  }

  return index;
}

/**
 * Calculates duration between two dates in years and months
 */
export function calculateDuration(
  startDateStr: string,
  endDateStr: string
): string {
  const startDate = parseDateString(startDateStr);
  const endDate =
    endDateStr.toLowerCase() === "present" || !endDateStr
      ? new Date()
      : parseDateString(endDateStr);

  if (!startDate || !endDate) return "";

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();

  // Adjust if months is negative
  if (months < 0) {
    years--;
    months += 12;
  }

  // If end date is before start date in the same year, adjust
  if (years < 0 || (years === 0 && months < 0)) {
    return "";
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} year${years > 1 ? "s" : ""}`);
  }
  if (months > 0) {
    parts.push(`${months} month${months > 1 ? "s" : ""}`);
  }

  return parts.join(" ");
}
