"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User } from "../../../Interfaces";

export default function page() {
  const [users, setUsers] = useState<User>({
    userName: "User's Name",
    email: "UserName@gmail.com",
    PhoneNumber: "0000000000",
    imageSrc: "",
  });
  return (
    <div className="px-10 pt-7 pb-20 md:pb-0 w-full h-auto md:h-full flex flex-col gap-3 items-center">
      <h1 className=" w-full text-center font-serif text-3xl font-bold border-b-2 border-gray-400 border-dashed pb-2 mb-4 md:mb-14">
        Profile
      </h1>

      <div className="relative w-[60%] xxs:w-[42%] xs:w-[30%] sm:w-[36%] md:w-[28%] lmd:w-[25%] xl:w-[20%]  h-[25vh] sm:h-[33vh] md:h-[37vh] border-2 border-gray-300 rounded-full shadow-lg">
        {users.imageSrc ? (
          <Image
            src={users.imageSrc}
            alt="User's image"
            width={100}
            height={100}
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font text-gray-500">
            NU
          </div>
        )}

        {/* Placeholder for image upload functionality */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setUsers({
                    ...users,
                    imageSrc: event.target?.result as string,
                  });
                  console.log(event.target?.result as string);
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
            className="hidden"
            id="fileInput"
          />

          <label
            htmlFor="fileInput"
            className="absolute bottom-4 right-4 flex items-center justify-center cursor-pointer stroke-white"
          >
            <svg
              className=" w-6 md:w-7 mx-auto bg-blue-500 rounded-full p-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M6 12H18M12 6V18"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </label>
        </div>
      </div>

      <div className="flex flex-col items-center pb-[2.2rem] border-b-2 border-gray-400 border-dashed w-full">
        <h2 className="font-bold text-xl">{users.userName}</h2>
        <h2 className="font-medium text-[1.15rem]">{users.email}</h2>
      </div>

      <section className=" flex flex-col gap-4 md:flex-row md:gap-8 w-full justify-between items-center pt-2 pb-4 border-b-2 border-gray-400 border-dashed">
        <div className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border">
          <h2 className="font-extrabold text-[1rem]">All Task</h2>
          <p className="text-sm font-bold  ">1000</p>
        </div>
        <div className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border">
          <h2 className="font-extrabold md:text=[0.85rem] lmd:text-[1rem]">
            Completed Tasks
          </h2>
          <p className="text-sm font-bold ">1000</p>
        </div>
        <div className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border">
          <h2 className="font-extrabold md:text=[0.85rem] lmd:text-[1rem]">
            Pending Tasks
          </h2>
          <p className="text-sm font-bold ">1000</p>
        </div>
        <Link
          href={"/documentation"}
          className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border"
        >
          <h2 className="font-extrabold text-[1rem]">Documents</h2>
          <p className="text-sm font-bold ">1000</p>
        </Link>
      </section>
    </div>
  );
}
