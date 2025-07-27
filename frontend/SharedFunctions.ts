import { DocumentType, User, UserTaskType } from "./Interfaces";

export const categories = [
  "Category",
  "Title",
  "Description",
  "Deadline",
  "Status",
  "More",
];

/**
 * Validates if the given deadline string is a valid date and not in the past.
 * @param {string} deadline - The deadline date in 'YYYY-MM-DD' format.
 * @returns {string | null} - An error message string if invalid, otherwise null.
 */
export function validateDeadline(deadline: string): string | null {
  if (!deadline) {
    return "Deadline is required.";
  }
  // Normalize today's date to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse the deadline string into a date object
  // And Normalize it to midnight for comparison
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  if (deadline.toString() === "Invalid Date") {
    // Check if parse failed
    return "Invalid dealine format. Please use DD-MM-YYYY";
  }

  if (deadlineDate.getTime() < today.getTime()) {
    const todayFormatted = today.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `Deadline can't be earlier than today (${todayFormatted})`;
  }

  return null; // No error
}

/**
 * Extract user-friendly error message from Api error response
 * @param {any} error - An error object
 * @return {string} - user friendly error message
 */
export function getApiErrorMessage(error: any): string {
  console.error(error.response?.data || error);

  const data = error.response?.data;

  let message = "";

  // Try to get the message from known places
  if (data?.error) {
    const firstKey = Object.keys(data.errors)[0];
    message = data.errors[firstKey]?.[0] || "";
  } else if (typeof data === "string") {
    message = data;
  } else if (error.message) {
    message = error.message;
  }

  // If message looks too long, consider it unfriendly
  if (message && message.length <= 200) {
    return message;
  }

  return "An unexpected error occurred.";
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

// export const ment: DocumentType[] = [
//   {
//     id: "1",
//     title: "Document of life ",
//     date: "date",
//     isHovered: false,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   },
//   {
//     id: "2",
//     title: "Tasks to complete ",
//     date: "date",
//     isHovered: false,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   },
//   {
//     id: "3",
//     title: "Aglorthim of Calculation",
//     date: "date",
//     isHovered: false,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   },
// ];
