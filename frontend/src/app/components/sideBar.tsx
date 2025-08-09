"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import clsx from "clsx";
import { NavBarToolTips } from "../../../Interfaces";
import { usePathname } from "next/navigation";

export default function sideBar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  // const [width, setWidth] = useState<number>(0);
  const [isMaximized, setIsMaximized] = useState<boolean>(true);
  const [showSideBar, setShowSideBar] = useState<boolean>(true);
  const [showToolTips, setShowToolTips] = useState<NavBarToolTips>({
    createTask: false,
    home: false,
    myTask: false,
    documentation: false,
    setting: false,
    logOut: false,
  });

  const handleResize = () => {
    const w = window.innerWidth;

    if (w >= 600) {
      setShowSideBar(true);
      setIsMaximized(w > 815);
      // window.innerWidth <= 815 ? setIsMaximized(false) : setIsMaximized(true);
    } else {
      setShowSideBar(false);
      setIsMaximized(false);
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className=" h-[96Vh] sm:my-[2vh] sm:ml-[0.5vh] sm:pt-2 pb-3.5 sm:px-3 md:px-2 text-black ">
      {showSideBar && isAuthenticated && (
        <div className=" h-[95vh] flex flex-col justify-between pt-2 ">
          <ul
            className={clsx(`flex flex-col gap-4 text-sm md:text-[1rem]`, {
              "gap-2": isMaximized,
            })}
          >
            <li>
              <div
                className={clsx(
                  `flex items-center pb-3 gap-3 pl-2 border-b-[3px] border-dashed border-gray-400 cursor-pointer`,
                  {
                    "pl-1": isMaximized,
                  }
                )}
              >
                {/* Hammburger Icon  */}
                <svg
                  className=" w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setIsMaximized(!isMaximized)}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z"
                      fill="#1C274C"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z"
                      fill="#1C274C"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z"
                      fill="#1C274C"
                    ></path>
                  </g>
                </svg>
              </div>
            </li>

            {/* ----------------- CREATE TASK------------------ */}
            <li className=" my-4">
              <Link href={"/mytasks/createtask"}>
                <div>
                  {isMaximized && (
                    <div
                      className={`${
                        pathname === "/mytasks/createtask"
                          ? "bg-black text-white fill-white"
                          : "bg-white fill-black"
                      }  flex items-center pl-2 gap-2 border-2 hover:border-black py-2 rounded-lg cursor-pointer`}
                    >
                      {/* @* Plus Icon *@ */}
                      <svg
                        className=" w-5 md:w-6 "
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <title>plus-circle</title>
                          <desc>Created with Sketch Beta.</desc>
                          <defs> </defs>
                          <g id="Page-1" strokeWidth="1" fillRule="evenodd">
                            <g
                              id="Icon-Set"
                              transform="translate(-464.000000, -1087.000000)"
                            >
                              <path
                                d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z"
                                id="plus-circle"
                              >
                                {" "}
                              </path>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <p className=" font-medium">New task</p>
                    </div>
                  )}
                  {!isMaximized && (
                    <div className=" h-[3.25rem]">
                      <div
                        className={`${
                          pathname === "/mytasks/createtask"
                            ? "bg-black text-white stroke-white"
                            : ""
                        } cursor-pointer p-2.5 rounded-full  hover:bg-black hover:text-white stroke-black  hover:stroke-white`}
                        onMouseEnter={() =>
                          setShowToolTips((prev) => ({
                            ...prev,
                            createTask: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setShowToolTips((prev) => ({
                            ...prev,
                            createTask: false,
                          }))
                        }
                      >
                        <svg
                          className=" w-6 md:w-7 mx-auto"
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
                      </div>
                      {showToolTips.createTask && (
                        <p className=" font-bold text-[10.5px]">New task</p>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </li>

            {/* ----------HOME----------- */}
            <li className={clsx({ "h-[3.25rem]": !isMaximized })}>
              <Link href={`/`}>
                <div
                  onMouseEnter={() =>
                    setShowToolTips((prev) => ({ ...prev, home: true }))
                  }
                  onMouseLeave={() =>
                    setShowToolTips((prev) => ({ ...prev, home: false }))
                  }
                  className={clsx(
                    `${
                      pathname === "/home"
                        ? "bg-black text-white fill-white"
                        : ""
                    } flex  items-center p-2 gap-2.5 cursor-pointer rounded-full hover:bg-black hover:text-white fill-black hover:fill-white`,
                    {
                      "rounded-lg border-2 border-gray-600 ": isMaximized,
                      "rounded-full p-3": !isMaximized,
                    }
                  )}
                >
                  <svg
                    className={clsx(`w-6 md:w-7  `, {
                      "mx-auto": !isMaximized,
                    })}
                    viewBox="0 0 1920 1920"
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
                        d="M960.16 0 28 932.16l79 78.777 853.16-853.16 853.16 853.16 78.889-78.777L960.16 0Zm613.693 1027.34v781.078h-334.86v-557.913h-557.8v557.912H346.445V1027.34H234.751V1920h1450.684v-892.66h-111.582Zm-446.33 334.748v446.441H792.775v-446.441h334.748ZM960.127 692.604c61.593 0 111.582 49.989 111.582 111.582 0 61.594-49.989 111.583-111.582 111.583-61.594 0-111.583-49.99-111.583-111.583 0-61.593 49.99-111.582 111.583-111.582Zm223.165 111.582c0-123.075-100.09-223.165-223.165-223.165-123.076 0-223.165 100.09-223.165 223.165 0 123.076 100.09 223.165 223.165 223.165 123.075 0 223.165-100.09 223.165-223.165"
                        fillRule="evenodd"
                      ></path>
                    </g>
                  </svg>
                  {isMaximized && <p className=" font-medium">Home</p>}
                </div>
              </Link>
              {!isMaximized && showToolTips.home && (
                <p className=" text-center font-bold text-[10.5px]">Home</p>
              )}
            </li>

            {/* ---------------MY TASK------------- */}
            <li className={clsx({ "h-[3.25rem]": !isMaximized })}>
              <Link href={`/mytasks`}>
                <div
                  onMouseEnter={() =>
                    setShowToolTips((prev) => ({ ...prev, myTask: true }))
                  }
                  onMouseLeave={() =>
                    setShowToolTips((prev) => ({ ...prev, myTask: false }))
                  }
                  className={clsx(
                    `${
                      pathname.includes("mytasks") &&
                      !pathname.includes("createtask")
                        ? "bg-black text-white fill-white"
                        : ""
                    } flex items-center p-2 gap-2.5 cursor-pointer hover:bg-black hover:text-white fill-black hover:fill-white`,
                    {
                      "rounded-lg border-2 border-gray-600 ": isMaximized,
                      "rounded-full p-3": !isMaximized,
                    }
                  )}
                >
                  <svg
                    className={clsx(`w-6 md:w-7  `, {
                      "mx-auto": !isMaximized,
                    })}
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M716 190.9v-67.8h-44v67.8H352v-67.8h-44v67.8H92v710h840v-710H716z m-580 44h172v69.2h44v-69.2h320v69.2h44v-69.2h172v151.3H136V234.9z m752 622H136V402.2h752v454.7z"></path>
                      <path d="M319 565.7m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M510 565.7m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M701.1 565.7m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M319 693.4m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M510 693.4m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M701.1 693.4m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                    </g>
                  </svg>
                  {isMaximized && <p className=" font-medium">My task</p>}
                </div>
              </Link>
              {!isMaximized && showToolTips.myTask && (
                <p className=" text-center font-bold text-[10.5px]">My Task</p>
              )}
            </li>

            {/* --------------DOCUMENTATION------------- */}
            <li className={clsx({ "h-[3.25rem]": !isMaximized })}>
              <Link href="/documentation">
                <div
                  onMouseEnter={() =>
                    setShowToolTips((prev) => ({
                      ...prev,
                      documentation: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setShowToolTips((prev) => ({
                      ...prev,
                      documentation: false,
                    }))
                  }
                  className={clsx(
                    `${
                      pathname === "/documentation"
                        ? "bg-black text-white fill-white"
                        : ""
                    } flex  items-center p-2 gap-2.5 cursor-pointer hover:bg-black hover:text-white fill-black hover:fill-white`,
                    {
                      "rounded-lg border-2 border-gray-600 ": isMaximized,
                      "rounded-full p-3": !isMaximized,
                    }
                  )}
                >
                  <svg
                    className={clsx(`w-6 md:w-7  `, {
                      "mx-auto": !isMaximized,
                    })}
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M719.8 651.8m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z"></path>
                      <path d="M512.1 64H172v896h680V385.6L512.1 64z m278.8 324.3h-280v-265l280 265zM808 916H216V108h278.6l0.2 0.2v296.2h312.9l0.2 0.2V916z"></path>
                      <path d="M280.5 530h325.9v16H280.5z"></path>
                      <path d="M639.5 530h90.2v16h-90.2z"></path>
                      <path d="M403.5 641.8h277v16h-277z"></path>
                      <path d="M280.6 641.8h91.2v16h-91.2z"></path>
                      <path d="M279.9 753.7h326.5v16H279.9z"></path>
                      <path d="M655.8 753.7h73.9v16h-73.9z"></path>
                    </g>
                  </svg>
                  {isMaximized && <p className=" font-medium">Documentation</p>}
                </div>
              </Link>
              {!isMaximized && showToolTips.documentation && (
                <p className=" text-center font-bold text-[10.5px]">Document</p>
              )}
            </li>
          </ul>

          {/* Footer Nav */}

          <ul className="mb-3 pt-2 border-t-[3px] border-dashed border-gray-400">
            {/* -----------SETTINGS------------- */}
            <li
              className={clsx({
                "mb-2": isMaximized,
                "h-[3.25rem] mb-1": !isMaximized,
              })}
            >
              <Link href="/settings">
                <div
                  onMouseEnter={() =>
                    setShowToolTips((prev) => ({ ...prev, setting: true }))
                  }
                  onMouseLeave={() =>
                    setShowToolTips((prev) => ({ ...prev, setting: false }))
                  }
                  className={clsx(
                    ` ${
                      pathname === "/settings"
                        ? "bg-black text-white stroke-white"
                        : ""
                    } flex  items-center p-2 gap-2.5 cursor-pointer  hover:bg-black hover:text-white stroke-black hover:stroke-white`,
                    {
                      "rounded-lg border-2 border-gray-600 ": isMaximized,
                      "rounded-full p-3": !isMaximized,
                    }
                  )}
                >
                  <svg
                    className={clsx(`w-6 md:w-7  `, {
                      "mx-auto": !isMaximized,
                    })}
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.0175 19C10.6601 19 10.3552 18.7347 10.297 18.373C10.2434 18.0804 10.038 17.8413 9.76171 17.75C9.53658 17.6707 9.31645 17.5772 9.10261 17.47C8.84815 17.3365 8.54289 17.3565 8.30701 17.522C8.02156 17.7325 7.62943 17.6999 7.38076 17.445L6.41356 16.453C6.15326 16.186 6.11944 15.7651 6.33361 15.458C6.49878 15.2105 6.52257 14.8914 6.39601 14.621C6.31262 14.4332 6.23906 14.2409 6.17566 14.045C6.08485 13.7363 5.8342 13.5051 5.52533 13.445C5.15287 13.384 4.8779 13.0559 4.87501 12.669V11.428C4.87303 10.9821 5.18705 10.6007 5.61601 10.528C5.94143 10.4645 6.21316 10.2359 6.33751 9.921C6.37456 9.83233 6.41356 9.74433 6.45451 9.657C6.61989 9.33044 6.59705 8.93711 6.39503 8.633C6.1424 8.27288 6.18119 7.77809 6.48668 7.464L7.19746 6.735C7.54802 6.37532 8.1009 6.32877 8.50396 6.625L8.52638 6.641C8.82735 6.84876 9.21033 6.88639 9.54428 6.741C9.90155 6.60911 10.1649 6.29424 10.2375 5.912L10.2473 5.878C10.3275 5.37197 10.7536 5.00021 11.2535 5H12.1115C12.6248 4.99976 13.0629 5.38057 13.1469 5.9L13.1625 5.97C13.2314 6.33617 13.4811 6.63922 13.8216 6.77C14.1498 6.91447 14.5272 6.87674 14.822 6.67L14.8707 6.634C15.2842 6.32834 15.8528 6.37535 16.2133 6.745L16.8675 7.417C17.1954 7.75516 17.2366 8.28693 16.965 8.674C16.7522 8.99752 16.7251 9.41325 16.8938 9.763L16.9358 9.863C17.0724 10.2045 17.3681 10.452 17.7216 10.521C18.1837 10.5983 18.5235 11.0069 18.525 11.487V12.6C18.5249 13.0234 18.2263 13.3846 17.8191 13.454C17.4842 13.5199 17.2114 13.7686 17.1083 14.102C17.0628 14.2353 17.0121 14.3687 16.9562 14.502C16.8261 14.795 16.855 15.1364 17.0323 15.402C17.2662 15.7358 17.2299 16.1943 16.9465 16.485L16.0388 17.417C15.7792 17.6832 15.3698 17.7175 15.0716 17.498C14.8226 17.3235 14.5001 17.3043 14.2331 17.448C14.0428 17.5447 13.8475 17.6305 13.6481 17.705C13.3692 17.8037 13.1636 18.0485 13.1099 18.346C13.053 18.7203 12.7401 18.9972 12.3708 19H11.0175Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9747 12C13.9747 13.2885 12.9563 14.333 11.7 14.333C10.4437 14.333 9.42533 13.2885 9.42533 12C9.42533 10.7115 10.4437 9.66699 11.7 9.66699C12.9563 9.66699 13.9747 10.7115 13.9747 12Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>

                  {isMaximized && <p className=" font-medium">Settings</p>}
                </div>
              </Link>
              {!isMaximized && showToolTips.setting && (
                <p className=" text-center font-bold text-[10.5px]">settings</p>
              )}
            </li>

            {/* ---------------LOG OUT------------------- */}
            <li className={clsx({ "h-[3.25rem]": !isMaximized })}>
              <Link href="/logout">
                <div
                  onMouseEnter={() =>
                    setShowToolTips((prev) => ({ ...prev, logOut: true }))
                  }
                  onMouseLeave={() =>
                    setShowToolTips((prev) => ({ ...prev, logOut: false }))
                  }
                  className={clsx(
                    `flex  items-center p-2 gap-2.5 cursor-pointer   hover:bg-red-600 hover:text-white stroke-black hover:stroke-white`,
                    {
                      "rounded-lg border-2 border-gray-600 hover:border-white pl-[0.6rem] ":
                        isMaximized,
                      "rounded-full p-3 ": !isMaximized,
                    }
                  )}
                >
                  <svg
                    className={clsx(`w-6 md:w-7  `, {
                      "mx-auto": !isMaximized,
                    })}
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
                        d="M14 20H6C4.89543 20 4 19.1046 4 18L4 6C4 4.89543 4.89543 4 6 4H14M10 12H21M21 12L18 15M21 12L18 9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                  {isMaximized && <p className=" font-medium">Log out</p>}
                </div>
                {!isMaximized && showToolTips.logOut && (
                  <p className=" text-center font-bold text-[10.5px]">
                    Log out
                  </p>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}

      {
        // ---------------- MOBILE VIEW -------------------
        !showSideBar && isAuthenticated && (
          <div className=" w-full fixed bottom-0 bg-[#dadde2] z-50">
            <ul className="flex justify-between items-center  text-xs xxs:text-sm px-6 xxs:px-8 pt-2  ">
              {/* --------------- HOME -------------- */}
              <li className="p-2 rounded-2xl  hover:bg-black hover:text-white fill-black hover:fill-white">
                <Link href="/" className=" ">
                  <svg
                    className="w-5 xxs:w-6 mx-auto mb-1 "
                    viewBox="0 0 1920 1920"
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
                        d="M960.16 0 28 932.16l79 78.777 853.16-853.16 853.16 853.16 78.889-78.777L960.16 0Zm613.693 1027.34v781.078h-334.86v-557.913h-557.8v557.912H346.445V1027.34H234.751V1920h1450.684v-892.66h-111.582Zm-446.33 334.748v446.441H792.775v-446.441h334.748ZM960.127 692.604c61.593 0 111.582 49.989 111.582 111.582 0 61.594-49.989 111.583-111.582 111.583-61.594 0-111.583-49.99-111.583-111.583 0-61.593 49.99-111.582 111.583-111.582Zm223.165 111.582c0-123.075-100.09-223.165-223.165-223.165-123.076 0-223.165 100.09-223.165 223.165 0 123.076 100.09 223.165 223.165 223.165 123.075 0 223.165-100.09 223.165-223.165"
                        fillRule="evenodd"
                      ></path>
                    </g>
                  </svg>
                  <p>Home</p>
                </Link>
              </li>

              {/* ---------- MY TASK ----------- */}
              <li className="p-3 rounded-2xl  hover:bg-black hover:text-white fill-black hover:fill-white">
                <Link href="/mytasks" className="">
                  <svg
                    className="w-5 xxs:w-6 mx-auto mb-1"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M716 190.9v-67.8h-44v67.8H352v-67.8h-44v67.8H92v710h840v-710H716z m-580 44h172v69.2h44v-69.2h320v69.2h44v-69.2h172v151.3H136V234.9z m752 622H136V402.2h752v454.7z"></path>
                      <path d="M319 565.7m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M510 565.7m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M701.1 565.7m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M319 693.4m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M510 693.4m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                      <path d="M701.1 693.4m-33 0a33 33 0 1 0 66 0 33 33 0 1 0-66 0Z"></path>
                    </g>
                  </svg>
                  <p>Task</p>
                </Link>
              </li>

              {/* -------------- CREATE TASK --------------- */}
              <li className="ml-3 mb-2 p-2 rounded-2xl cursor-pointer hover:bg-black fill-black hover:fill-white">
                <Link href={"/mytasks/createtask"}>
                  <div className="">
                    <svg
                      className=" w-8 xxs:w-10 "
                      viewBox="0 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM23 15h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path>
                      </g>
                    </svg>
                  </div>
                </Link>
              </li>

              {/* ------------- DOCUMENTATION ------------ */}
              <li className="p-2 rounded-2xl hover:bg-black">
                <Link
                  href="/documentation"
                  className=" hover:text-white fill-black hover:fill-white"
                >
                  <svg
                    className=" w-5 xxs:w-6 mx-auto mb-1 "
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M719.8 651.8m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z"></path>
                      <path d="M512.1 64H172v896h680V385.6L512.1 64z m278.8 324.3h-280v-265l280 265zM808 916H216V108h278.6l0.2 0.2v296.2h312.9l0.2 0.2V916z"></path>
                      <path d="M280.5 530h325.9v16H280.5z"></path>
                      <path d="M639.5 530h90.2v16h-90.2z"></path>
                      <path d="M403.5 641.8h277v16h-277z"></path>
                      <path d="M280.6 641.8h91.2v16h-91.2z"></path>
                      <path d="M279.9 753.7h326.5v16H279.9z"></path>
                      <path d="M655.8 753.7h73.9v16h-73.9z"></path>
                    </g>
                  </svg>
                  <p>Document</p>
                </Link>
              </li>

              {/* ----------- SETTINGS ------------ */}
              <li className="p-2 rounded-2xl  hover:bg-black hover:text-white stroke-black hover:stroke-white">
                <Link href="/settings" className="">
                  <svg
                    className=" w-5 xxs:w-7 mx-auto mb-1 "
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.0175 19C10.6601 19 10.3552 18.7347 10.297 18.373C10.2434 18.0804 10.038 17.8413 9.76171 17.75C9.53658 17.6707 9.31645 17.5772 9.10261 17.47C8.84815 17.3365 8.54289 17.3565 8.30701 17.522C8.02156 17.7325 7.62943 17.6999 7.38076 17.445L6.41356 16.453C6.15326 16.186 6.11944 15.7651 6.33361 15.458C6.49878 15.2105 6.52257 14.8914 6.39601 14.621C6.31262 14.4332 6.23906 14.2409 6.17566 14.045C6.08485 13.7363 5.8342 13.5051 5.52533 13.445C5.15287 13.384 4.8779 13.0559 4.87501 12.669V11.428C4.87303 10.9821 5.18705 10.6007 5.61601 10.528C5.94143 10.4645 6.21316 10.2359 6.33751 9.921C6.37456 9.83233 6.41356 9.74433 6.45451 9.657C6.61989 9.33044 6.59705 8.93711 6.39503 8.633C6.1424 8.27288 6.18119 7.77809 6.48668 7.464L7.19746 6.735C7.54802 6.37532 8.1009 6.32877 8.50396 6.625L8.52638 6.641C8.82735 6.84876 9.21033 6.88639 9.54428 6.741C9.90155 6.60911 10.1649 6.29424 10.2375 5.912L10.2473 5.878C10.3275 5.37197 10.7536 5.00021 11.2535 5H12.1115C12.6248 4.99976 13.0629 5.38057 13.1469 5.9L13.1625 5.97C13.2314 6.33617 13.4811 6.63922 13.8216 6.77C14.1498 6.91447 14.5272 6.87674 14.822 6.67L14.8707 6.634C15.2842 6.32834 15.8528 6.37535 16.2133 6.745L16.8675 7.417C17.1954 7.75516 17.2366 8.28693 16.965 8.674C16.7522 8.99752 16.7251 9.41325 16.8938 9.763L16.9358 9.863C17.0724 10.2045 17.3681 10.452 17.7216 10.521C18.1837 10.5983 18.5235 11.0069 18.525 11.487V12.6C18.5249 13.0234 18.2263 13.3846 17.8191 13.454C17.4842 13.5199 17.2114 13.7686 17.1083 14.102C17.0628 14.2353 17.0121 14.3687 16.9562 14.502C16.8261 14.795 16.855 15.1364 17.0323 15.402C17.2662 15.7358 17.2299 16.1943 16.9465 16.485L16.0388 17.417C15.7792 17.6832 15.3698 17.7175 15.0716 17.498C14.8226 17.3235 14.5001 17.3043 14.2331 17.448C14.0428 17.5447 13.8475 17.6305 13.6481 17.705C13.3692 17.8037 13.1636 18.0485 13.1099 18.346C13.053 18.7203 12.7401 18.9972 12.3708 19H11.0175Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9747 12C13.9747 13.2885 12.9563 14.333 11.7 14.333C10.4437 14.333 9.42533 13.2885 9.42533 12C9.42533 10.7115 10.4437 9.66699 11.7 9.66699C12.9563 9.66699 13.9747 10.7115 13.9747 12Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                  <p>Settings</p>
                </Link>
              </li>
            </ul>
          </div>
        )
      }
    </div>
  );
}
