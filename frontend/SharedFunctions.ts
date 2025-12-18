import { DocumentType, User, UserTaskType } from "./Interfaces";

export const categories = [
  "Category",
  "Title",
  "Created",
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
 * @param {unknown} error - An error object
 * @return {string} - user friendly error message
 */
export function getApiErrorMessage(error: unknown): string {
  console.error(error);
  let message = "";

  // Check if it's an Axios-style error object
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data: unknown } };
    const data = axiosError.response?.data;

    if (data && typeof data === "object") {
      const errorData = data as {
        errors?: Record<string, string[]>;
        title?: string;
        detail?: string;
      };

      if (errorData.errors) {
        const firstKey = Object.keys(errorData.errors)[0];
        message = errorData.errors[firstKey]?.[0] || "";
      } else if (errorData.title) {
        message = errorData.title;
      } else if (errorData.detail) {
        message = errorData.detail;
      }
    } else if (typeof data === "string") {
      message = data;
    }
  }
  
  // Fallback to generic Error message (like "Network Error")
  if (!message && error instanceof Error) {
    message = error.message;
  }

  // Final check for length and existence
  if (message && message.length <= 200) {
    return message;
  }

  return "An unexpected error occurred.";
}

export const formatDate = (isoString: string, format?: string) => {
  const date = new Date(isoString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  if (format) {
    return `${year}-${month}-${day}`;
  }

  return `${month}-${day}-${year}`;
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
