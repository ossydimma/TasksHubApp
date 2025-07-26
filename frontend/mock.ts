import { DocumentType, User, UserTaskType } from "./Interfaces";

export const categories = [
  "Category",
  "Title",
  "Description",
  "Deadline",
  "Status",
  "More",
];
export function validateDeadline (deadline: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  if (deadlineDate < today) {
    return false;
  }
  
  return true;
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

export const ment: DocumentType[] = [
  {
    id: "1",
    title: "Document of life ",
    date: "date",
    isHovered: false,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "2",
    title: "Tasks to complete ",
    date: "date",
    isHovered: false,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "3",
    title: "Aglorthim of Calculation",
    date: "date",
    isHovered: false,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

// export const tasks: UserTaskType[] = [
//   {
//     Id: "0",
//     Title: "Design a Hero page",
//     Description:
//       "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Category: "Work",
//     Deadline: new Date("2023-06-10"),
//     Status: true,
//   },
//   {
//     Id: "1",
//     Title: "Shopping",
//     Description:
//       "Tue hede are a you doing now cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede are a you doing now cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Deadline: new Date("2023-06-10"),
//     Category: "Work",
//     Status: false,
//   },
//   {
//     Id: "3",
//     Title: "Design a Hero page",
//     Description:
//       "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Category: "Work",
//     Deadline: new Date("2023-06-10"),
//     Status: true,
//   },
//   {
//     Id: "4",
//     Title: "Design a Hero page",
//     Description:
//       "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Category: "Work",
//     Deadline: new Date("2023-06-10"),
//     Status: false,
//   },
//   {
//     Id: "5",
//     Title: "Design a Hero page",
//     Description:
//       "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Category: "Work",
//     Deadline: new Date("2023-06-10"),
//     Status: true,
//   },
//   {
//     Id: "6",
//     Title: "Design a Hero page",
//     Description:
//       "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Category: "Work",
//     Deadline: new Date("2023-06-10"),
//     Status: true,
//   },
//   {
//     Id: "7",
//     Title: "Design a Hero page",
//     Description:
//       "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Category: "Work",
//     Deadline: new Date("2023-06-10"),
//     Status: true,
//   },
//   {
//     Id: "8",
//     Title: "Design a Hero page",
//     Description:
//       "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
//     Category: "Work",
//     Deadline: new Date("2023-06-10"),
//     Status: true,
//   },
// ];
