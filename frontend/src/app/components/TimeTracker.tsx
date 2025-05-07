"use client";
import { useState, useEffect } from "react";

export default function TimeTracker() {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, "0")}: ${String(minutes).padStart(
      2,
      "0"
    )}: ${String(seconds).padStart(2, "0")}`;
  };

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    stopTimer();
    setElapsedTime(0);
  };

  return (
    <div className="bg-black text-white text-center mt-2 mb-[5rem] sm:mb-4 md:mb-0 h-[11.5rem] rounded-3xl py-4 mx-2 md:mx-0">
      <div className=" flex flex-col gap-3">
        <h2 className="font-bold text-2xl font-serif">Time Tracker</h2>

        <h1 className="font-semibold text-3xl font-mono">
          {formatTime(elapsedTime)}
        </h1>
        <div className="flex gap-3 ml-4 justify-center items-center font-mono text-sm text-center -mt-4">
          <p className="">Hours</p>
          <p className="">Minutes</p>
          <p className="">Seconds</p>
        </div>

        {!isRunning && (
          //   ------------- START ------------
          <button
            className=" bg-green-600 text-white p-3 w-12 mx-auto rounded-full cursor-pointer"
            onClick={startTimer}
          >
            <svg
              className="w-5 mx-auto"
              viewBox="0 0 16 16"
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
                  d="M5 16L7 16L15 8L7 -2.7818e-08L5 0L5 16Z"
                  fill="#fff"
                ></path>
              </g>
            </svg>
          </button>
        )}

        {isRunning && (
          // ------------- STOP ------------
          <div className="flex gap-4 justify-center items-center ">
            <button
              className=" bg-red-600 text-white p-3 rounded-full cursor-pointer"
              onClick={stopTimer}
            >
              <div className="w-4 h-4 rounded-sm bg-white"></div>
            </button>

            {/* // ------------- RESET ------------  */}
            <button
              className=" bg-orange-600 text-white p-3 rounded-full cursor-pointer"
              onClick={resetTimer}
            >
              <svg
                className="w-4"
                viewBox="0 0 24.00 24.00"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#CCCCCC"
                  strokeWidth="0.048"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g clipPath="url(#clip0_429_11071)">
                    <path
                      d="M12 2.99982C16.9706 2.99982 21 7.02925 21 11.9998C21 16.9704 16.9706 20.9998 12 20.9998C7.02944 20.9998 3 16.9704 3 11.9998C3 9.17255 4.30367 6.64977 6.34267 4.99982"
                      stroke="#fff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M3 4.49982H7V8.49982"
                      stroke="#fff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_429_11071">
                      <rect width="24" height="24" fill="white"></rect>
                    </clipPath>
                  </defs>
                </g>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
