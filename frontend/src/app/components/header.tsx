"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";

export default function header() {
  const [showDate, setShowDate] = useState<boolean>(
    window.innerWidth >= 640 ? true : false
  );

  const formattedDate = moment().format("dddd, MMMM D");

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    if (window.innerWidth >= 640) {
      setShowDate(true);
    } else {
      setShowDate(false);
    }
  };

  return (
    <div className="  w-[100%] h-[8vh] px-2 md:px-6 sm:pt-[6vh] sm:pb-[4vh]  flex items-center justify-between border-dashed @GetResponsiveClass()">
      <div className=" flex items-center gap-1 ">
        <div className="p-2 rounded-lg bg-[#5577FF]">
          <svg
            className="w-4"
            viewBox="0 0 32 32"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <defs>
                <style>
                  {`
                        .cls-1 {
                            fill: #fff;
                        }

                        .cls-2 {
                            fill: none;
                        }
                    `}
                </style>
              </defs>
              <title>logo--tumblr</title>
              <path
                className="cls-1"
                d="M22.6,28h-4c-3.59,0-6.3-1.86-6.3-6.3V14.58H9V10.72A7.17,7.17,0,0,0,14.3,4h3.76v6.12h4.36v4.46H18.06v6.2c0,1.86.94,2.49,2.42,2.49H22.6Z"
              ></path>
              <rect
                id="_Transparent_Rectangle_"
                data-name="<Transparent Rectangle>"
                className="cls-2"
                width="32"
                height="32"
              ></rect>
            </g>
          </svg>
        </div>
        <h2 className=" md:text-[1rem] lg:text-lg font-extrabold">Taskhub</h2>
      </div>

      {/* @*      SEARCH BAR           *@ */}
      <div className=" w-[30%] lg:w-[45%] hidden sm:flex items-center justify-between  px-3.5 border border-gray-600 rounded-3xl ">
        <input
          type="text"
          placeholder="Search"
          className="w-[90%] bg-inherit py-2 outline-none"
        />
        <svg
          className="w-7 cursor-pointer "
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
            <g clipPath="url(#clip0_15_152)">
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                stroke="#000000"
                strokeLinejoin="round"
              ></circle>
              <path
                d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z"
                fill="#000000"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_15_152">
                <rect width="24" height="24" fill="white"></rect>
              </clipPath>
            </defs>
          </g>
        </svg>
      </div>

      <div className=" flex items-center gap-1.5 md:gap-3">
        {/* Profile */}
        <Link
          href={"/profile"}
          className="p-2 rounded-full border-2 border-black cursor-pointer"
        >
          <svg
            className=" w-3"
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
                d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </Link>
        {showDate && (
          <div className=" flex items-center justify-center gap-1 stroke-black  border-l-2 border-l-black pl-1.5 md:pl-3 ">
            <svg
              className=" w-4 "
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
                  d="M3 9H21M9 15L11 17L15 13M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            <p className="text-sm">{formattedDate}</p>
          </div>
        )}
      </div>
    </div>
  );
}
