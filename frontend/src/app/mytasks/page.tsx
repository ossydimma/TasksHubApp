"use client";

import { categories, formatDate } from "../../../SharedFunctions";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { FilterTaskType, UserTaskType } from "../../../Interfaces";
import LoadingSpinner from "../components/LoadingSpinner";
import { taskApi } from "../../../services/apiServices/TaskApiService";

export default function Page() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [tasks, setTasks] = useState<UserTaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<UserTaskType[]>([]);
  const [match, setMatch] = useState<string | string[]>("");
  const [query, setQuery] = useState<string>("");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [activeOrderBy, setActiveOrderBy] = useState({
    latest: true,
    oldest: false,
  });

  const [filterBy, setFilterBy] = useState<FilterTaskType>({
    status: null,
    created: null,
    deadline: null,
    category: null,
  });

  const statusOptions = [
    { id: 1, label: "None", value: "" },
    { id: 2, label: "Completed tasks", value: "completed" },
    { id: 3, label: "Pending tasks", value: "pending" },
    { id: 4, label: "Overdue tasks", value: "overdue" },
  ];

  const CategoryOptions = [
    { id: 1, label: "None", value: "" },
    { id: 2, label: "Work", value: "work" },
    { id: 3, label: "Personal", value: "personal" },
    { id: 4, label: "Others", value: "others" },
  ];

  let filterPayload: FilterTaskType = {
    deadline: null,
    created: null,
    category: null,
    status: null,
  };

  const handleFilterApiCall = useCallback(
    async (payload: FilterTaskType) => {
      try {
        const tasks = await taskApi.filterTask(payload);
        setFilteredTasks(validateOrder() ? tasks.reverse() : tasks);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
        setShowFilter(false);
      }
    },
    [ validateOrder, setFilteredTasks, setSearching, setShowFilter]
  );

  const validateFilterForm = (): boolean => {
    if (!Object.values(filterBy).some((val) => val !== "")) {
      return false;
    }

    const filledCred = Object.entries(filterBy)
      .filter(([, value]) => value !== null && value !== "")
      .map(([key, value]) => `${key}: ${value}`);

    setMatch(`No matching tasks found for "${filledCred.join(" or ")}". `);
    return true;
  };

  const handleFilterByForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formError = validateFilterForm();
    if (!formError) {
      return;
    }
    setSearching(true);

    filterPayload = {
      deadline: filterBy.deadline ? filterBy.deadline : null,
      created: filterBy.created ? filterBy.created : null,
      category: filterBy.category || null,
      status: filterBy.status || null,
    };

    handleFilterApiCall(filterPayload);
  };

  const resetFilterBy = useCallback(() => {
    setFilterBy({
      status: null,
      created: null,
      deadline: null,
      category: null,
    });
    setFilteredTasks(tasks);
    setShowFilter(false);
  }, [tasks]);

  function validateOrder(): boolean {
    const order = localStorage.getItem("orderBy");
    if (order) {
      setActiveOrderBy({ latest: false, oldest: true });
      return true;
    }

    return false;
  }

  useEffect(() => {
    const fetchTasks = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const params = searchParams.get("filter");

      async function getAllTasks() {
        setIsLoading(true);

        try {
          const allTasks = await taskApi.getAllTasks();

          setTasks(allTasks);
          setFilteredTasks(validateOrder() ? allTasks.reverse() : allTasks);
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
        } finally {
          setIsLoading(false);
        }
      }
      switch (params) {
        case "overdue":
          filterPayload.status = "overdue";
          handleFilterApiCall(filterPayload);
          setMatch(`You got no overdue task. `);
          break;
        case "todays":
          filterPayload.deadline = formatDate(
            new Date().toISOString(),
            "standard"
          );
          handleFilterApiCall(filterPayload);
          setMatch(`You got no task that will be due today. `);
          break;
        default:
          getAllTasks();
      }
    };

    fetchTasks();
  }, [filterPayload, handleFilterApiCall]);

  useEffect(() => {
    if (tasks.length < 1) {
      return;
    }

    setSearching(true);
    const handler = setTimeout(() => {
      if (query.trim() === "") {
        setFilteredTasks(tasks);
        setSearching(false);
      }
      resetFilterBy();
      const filtered: UserTaskType[] = tasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );

      setSearching(false);
      setMatch(query);

      setFilteredTasks(filtered);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, tasks, resetFilterBy]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  return (
    <main className="text-xs xs:text-sm md:text-[1rem] border-gray-500 h-full w-full overflow-hidden ">
      {isLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          style={{ cursor: "not-allowed" }}
        >
          <LoadingSpinner
            styles={{ svg: " h-10 w-10", span: "text-[1.2rem]" }}
            text="Loading..."
          />
        </div>
      )}
      <header className="flex justify-between  items-center px-4 md:px-7 mt-5 lmd:mt-4 -mb-2 border-b-2 border-dashed border-gray-500 pb-4">
        <div className="  ">
          <div className="py-2 px-4 text-sm bg-black text-white rounded-md cursor-pointer">
            Tasks
          </div>
        </div>

        <div
          className={`
           w-[40%] lg:w-[45%] flex items-center justify-between  border border-gray-600 rounded-3xl overflow-hidden`}
        >
          {query && (
            <div
              className="border-r-2 w-[15%] md:w-[13.5%] lmd:w-[10%] py-2 cursor-pointer"
              onClick={() => setQuery("")}
            >
              <svg
                className="w-5 lmd:w-7 mx-auto"
                viewBox="0 0 48 48"
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
                  <g id="cancel">
                    <g id="cancel_2">
                      <path
                        id="Combined Shape"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z"
                        fill="#000"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          )}
          <input
            type="text"
            placeholder="Search task by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[77.5%] bg-inherit py-2 outline-none pl-3 pr-1 lmd:pl-5 text-sm sm:text-[0.92rem] md:text-[1rem]"
          />

          <div
            className="bg-gray-700 hover:bg-black w-[18%] md:w-[15%] lmd:w-[12.5%] py-2 cursor-pointer "
            // onClick={getTaskByTitle}
            role="button"
            // tabIndex={0}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") getTaskByTitle();
            // }}
          >
            <svg
              className="w-5 lmd:w-7 mx-auto"
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
                    stroke="#fff"
                    strokeLinejoin="round"
                  ></circle>
                  <path
                    d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z"
                    fill="#fff"
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

        <div className="flex items-center gap-3 relative">
          {showFilter && (
            <div className="bg-black w-[17rem] text-white pt-4 pb-6 px-3 absolute -top-2 -right-2 z-10 rounded-xl">
              <div>
                <svg
                  className="w-6 ml-auto text-righ cursor-pointer"
                  onClick={() => {
                    setShowFilter(false);
                  }}
                  viewBox="0 0 48 48"
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
                    <g id="cancel">
                      <g id="cancel_2">
                        <path
                          id="Combined Shape"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z"
                          fill="#fff"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h1 className="text-[0.9rem] mb-1 pl-4 w-fit uppercase italic ">
                Filter by:
              </h1>

              <form
                action=""
                className="flex flex-col gap-2 border-2 rounded-xl p-4 italic"
                onSubmit={handleFilterByForm}
              >
                <div className={`flex flex-col text-sm w-[100%]`}>
                  <label className=" font-medium">Creation date</label>
                  <input
                    id="creation_date"
                    type="date"
                    value={filterBy.created ?? ""}
                    onChange={(e) => {
                      setFilterBy((prev) => ({
                        ...prev,
                        created: e.target.value,
                      }));
                    }}
                    // placeholder="DD/MM/YYYY"
                    className="border border-gray-600 text-black rounded-lg outline-none py-2 px-2 w-full"
                  />
                </div>
                <div className="text-sm">
                  <label className=" font-medium">Status</label>
                  <select
                    id="status"
                    value={filterBy.status ? filterBy.status : "None"}
                    onChange={(e) => {
                      setFilterBy((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }));
                    }}
                    name="status"
                    className="border border-gray-600 bg-transparent rounded-lg outline-none py-2 px-1  w-[100%]"
                  >
                    {statusOptions.map((option) => (
                      <option
                        className="text-black"
                        key={option.id}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`flex flex-col text-sm w-[100%]`}>
                  <label className=" font-medium">Deadline</label>
                  <input
                    id="deadline"
                    type="date"
                    value={filterBy.deadline ?? ""}
                    onChange={(e) => {
                      setFilterBy((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }));
                    }}
                    // placeholder="DD/MM/YYYY"
                    className="border border-gray-600 text-black rounded-lg outline-none py-2 px-2 w-full"
                  />
                </div>

                <div className="text-sm">
                  <label className=" font-medium">Category</label>
                  <select
                    id="category"
                    value={filterBy.category ?? ""}
                    onChange={(e) => {
                      setFilterBy((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }));
                    }}
                    name="category"
                    className="border border-gray-600 bg-transparent rounded-lg outline-none py-2 px-1  w-[100%]"
                  >
                    {CategoryOptions.map((cate) => (
                      <option
                        className="text-black"
                        key={cate.id}
                        value={cate.value}
                      >
                        {cate.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="my-4 flex justify-between items-center">
                  <div
                    onClick={resetFilterBy}
                    className="py-2 px-4 rounded-md cursor-pointer text-sm text-black hover:text-white  bg-white hover:bg-black border"
                  >
                    <button type="button">Reset</button>
                  </div>

                  <div className="py-2 px-4 rounded-md cursor-pointer text-sm text-black hover:text-white  bg-white hover:bg-black border">
                    <button type="submit">Confirm</button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* ------------ filter ------------- */}

          <div
            onClick={() => setShowFilter(true)}
            className=" border text-sm border-gray-600 rounded-md py-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white stroke-black hover:stroke-white"
          >
            <svg
              className="w-4"
              viewBox="-0.5 0 25 25"
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
                  d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            Filter
          </div>
        </div>

        <div className="w-fit hidden sm:flex border-2 border-black cursor-pointer rounded-2xl overflow-hidden">
          <div
            className={`py-2.5 px-4  ${
              activeOrderBy.latest ? "bg-gray-700 text-white" : ""
            }`}
            onClick={() => {
              if (!activeOrderBy.latest) {
                localStorage.removeItem("orderBy");
                setFilteredTasks(filteredTasks.reverse());
                setActiveOrderBy({ latest: true, oldest: false });
              }
            }}
          >
            Latest
          </div>
          <div
            className={`py-2.5 px-4 ${
              activeOrderBy.oldest ? "bg-gray-700 text-white" : ""
            }`}
            onClick={() => {
              if (!activeOrderBy.oldest) {
                localStorage.setItem("orderBy", "true");
                setFilteredTasks(filteredTasks.reverse());
                setActiveOrderBy({ latest: false, oldest: true });
              }
            }}
          >
            Oldest
          </div>
        </div>
      </header>

      <section className="h-[85vh] w-[98%] md:h-[90vh] overflow-hidden pt-10 mx-2  mb-[3rem] overflow-y-hidde">
        {searching ? (
          <div className="h-full w-full flex justify-center items-center">
            <LoadingSpinner
              styles={{
                svg: "h-6 w-6 sm:h-9 sm:w-9  lmd:h-6 lmd:w-6",
                span: "text-sm sm:text-[1.1rem] lmd:text-sm",
              }}
              text="Searching..."
            />
          </div>
        ) : tasks.length < 0 ? (
          <div className="h-full w-full flex flex-col gap-1 justify-center items-center font-bold text-[0.910rem] sm:text-[1.2rem] md:text-[0.8rem] lmd:text-[0.910rem]">
            <p>You have no task yet.</p>
            <div>
              <button
                onClick={() => router.push("/mytasks/createtask")}
                className="py-4 px-6 text-sm bg-black text-white rounded-2xl"
              >
                Create task
              </button>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center text-[0.910rem] sm:text-[1.2rem] md:text-[0.8rem] lmd:text-[0.910rem]">
            <p>{match}</p>
          </div>
        ) : (
          <div className="w-full h-[90%] pb-10 overflow-y-hidde ">
            <div className="grid grid-cols-6 gap-4 font-bold py-2 border-b-2 border-gray-500 mr-4">
              {categories.map((category, index) => (
                <h1
                  key={index}
                  className={`border-gray-400 p-2 text-center ${
                    category === "Description" ? "col-span-2" : ""
                  }`}
                >
                  {category}
                </h1>
              ))}
            </div>
            <div className="h-[100%] overflow-y-scroll overflow-x-hidden pb-6">
              {filteredTasks.map((task: UserTaskType) => (
                <ul key={task.id} className="grid grid-cols-6">
                  <li className="border justify-items-center border-gray-400 text-center py-10 sm:py-7">
                    {task.category}
                  </li>
                  <li className="border border-gray-400 text-center py-10 sm:py-7">
                    {task.title}
                  </li>
                  <li className="border border-gray-400 text-center py-10 sm:py-7">
                    {formatDate(task.creationDate)}
                  </li>
                  <li className="border border-gray-400 text-center py-10 sm:py-7">
                    {formatDate(task.deadline)}
                  </li>
                  <li
                    className={`border border-gray-400 text-center py-10 sm:py-7 ${
                      task.status === "Completed"
                        ? "text-green-500"
                        : task.status === "Pending"
                        ? "text-orange-600"
                        : "text-red-500"
                    }`}
                  >
                    {task.status}
                  </li>
                  <li className=" text-center py-10 sm:py-7 tooltip-container border border-gray-400 cursor-pointer">
                    <div className="tooltip">
                      <span>Options</span>
                      <div className="tooltiptext text-sm">
                        <ul>
                          <li
                            onClick={() => router.push(`/mytasks/${task.id}`)}
                          >
                            Details
                          </li>
                          <li
                            onClick={() =>
                              router.push(`/mytasks/edit/${task.id}`)
                            }
                          >
                            Edit
                          </li>
                          <li
                            onClick={() =>
                              router.push(`/mytasks/delete/${task.id}`)
                            }
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
