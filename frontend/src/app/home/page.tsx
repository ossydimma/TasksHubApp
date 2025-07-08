"use client";
import TimeTracker from ".././components/TimeTracker";
import Calendar from "react-calendar";
import Header from ".././components/header";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [date, setDate] = useState<Date | null>(null);
  const { isAuthenticated, loading } = useAuth();

  const router = useRouter();

  useEffect(()=> {
    setDate(new Date());
  }, [])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading]);

  return (
    <main className="text-black">
      <Header />
      <div className=" flex justify-center items-center border-dashed border-gray-500 border-b-2 pb-[2vh] pt-[-2vh]">
        <div className=" w-[60%] md:w-[50%] lg:w-[45%] flex sm:hidden items-center justify-between  px-3.5 border border-gray-600 rounded-3xl  ">
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
      </div>
      <div className=" flex justify-between items-cente flex-col gap-8 md:gap-2 md:flex-row mt-[2.5vh] sm:mt-[3.5vh]  px-3 z-50">
        <section className="  w-[100%] md:w-[65%] md:mx-8">
          <div className=" justify-between items-center mt-1 text-white ">
            <h1 className=" bg-black text-2xl lmd:text-3xl rounded-lg py-5 px-6 lmd:px-8 font-extrabold tracking-wide">
              {" "}
              <span className={`inline-block md:hidden xl:inline-block`}>
                Good day,
              </span>{" "}
              <span className="text-lg md:text-xl lmd:text-2xl">
                You got{" "}
                <span className="bg-white rounded-full text-black py-2 px-2.5 text-center">
                  10
                </span>{" "}
                task today.
              </span>{" "}
            </h1>
          </div>

          {/* ------------ LEFT CONTENT ----------------  */}

          <div className="mt-5 mx-2 md:mr-6 md:ml-2">
            <div className="flex justify-between items-center text-black mb-2 md:mb-2 lmd:mb-8 font-serif">
              <h2 className="font-bold text-xl md:text-2xl">Today's Task</h2>
              <p className=" text-right text-lg font-medium cursor-pointer">
                view all
              </p>
            </div>

            <div className=" flex flex-col gap-4 ">
              <div className="pt-5 md:pt-3 lmd:pt-5 px-6 shadow-lg border-gray-400 border-t-2">
                <p className=" font-semibold text-lg">
                  Landing PageTitle Agency Creative
                </p>
                <p className="text-sm font-medium mb-2">work project</p>

                <div className="flex items-center justify-between border-gray-400  border-t-2 py-4 md:py-2 lmd:py-4">
                  <p className="font-semibold">10-06-2024</p>
                  <div className="px-4 py-2 rounded-xl text-white bg-black cursor-pointer">
                    Pending
                  </div>
                </div>
              </div>

              <div className="pt-5 md:pt-3 lmd:pt-5 px-6 shadow-lg border-gray-400 border-t-2">
                <p className=" font-semibold text-lg">
                  Landing PageTitle Agency Creative
                </p>
                <p className="text-sm font-medium mb-2">personal project</p>

                <div className="flex items-center justify-between border-gray-400  border-t-2 py-4 md:py-2 lmd:py-4">
                  <p className="font-semibold">10-06-2024</p>
                  <div className="px-4 py-2 rounded-xl text-white bg-black cursor-pointer">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------ RIGHT CONTENT ----------------  */}
        <section className="w-[100%] md:w-[33%]">
          <Calendar
            // onChange={handleDateChange}
            value={date}
            className=" py-3 px-4 rounded-2xl  mx-2 md:mx-0"
          />
          <TimeTracker />
        </section>
      </div>
    </main>
  );
}
