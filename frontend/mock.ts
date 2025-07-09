  import { DocumentType, User, UserTask } from "./Interfaces";

  // export const UserDetails : User = {
  //   userName : "John Doe",
  //   email : "text_example@gamil.com",
  //   imageSrc : "https://images.unsplash.com/photo-1677631231234-1234567890ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //   // PhoneNumber : "+1 123 456 7890"
  // }
  
  export const categories = [
    "Category",
    "Title",
    "Description",
    "Deadline",
    "Status",
    "More",
  ];

  export const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  export const ment : DocumentType[] = [
    {
      id : "1",
      title : "Document of life ",
      formattedDate : formatDate(new Date()),
      isHovered : false,
      content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      id : "2",
      title : "Tasks to complete ",
      formattedDate : formatDate(new Date()),
      isHovered : false,
      content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      id : "3",
      title : "Aglorthim of Calculation",
      formattedDate : formatDate(new Date()),
      isHovered : false,
      content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
]

  export const tasks: UserTask[] = [
    {
      Id: "0",
      Title: "Design a Hero page",
      Description:
        "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Category: "Work",
      Deadline: new Date("2023-06-10"),
      Status: true,
    },
    {
      Id: "1",
      Title: "Shopping",
      Description:
        "Tue hede are a you doing now cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede are a you doing now cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Deadline: new Date("2023-06-10"),
      Category: "Work",
      Status: false,
    },
    {
      Id: "3",
      Title: "Design a Hero page",
      Description:
        "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Category: "Work",
      Deadline: new Date("2023-06-10"),
      Status: true,
    },
    {
      Id: "4",
      Title: "Design a Hero page",
      Description:
        "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Category: "Work",
      Deadline: new Date("2023-06-10"),
      Status: false,
    },
    {
      Id: "5",
      Title: "Design a Hero page",
      Description:
        "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Category: "Work",
      Deadline: new Date("2023-06-10"),
      Status: true,
    },
    {
      Id: "6",
      Title: "Design a Hero page",
      Description:
        "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Category: "Work",
      Deadline: new Date("2023-06-10"),
      Status: true,
    },
    {
      Id: "7",
      Title: "Design a Hero page",
      Description:
        "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Category: "Work",
      Deadline: new Date("2023-06-10"),
      Status: true,
    },
    {
      Id: "8",
      Title: "Design a Hero page",
      Description:
        "Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd Tue hede cjdndm jfjfkr ifdjfk jhdnd jhdd",
      Category: "Work",
      Deadline: new Date("2023-06-10"),
      Status: true,
    },
  ];