"use client";

import { useState } from "react";
import { modifyTaskParams, TaskModel } from "../../../Interfaces";
import { formatDate } from "../../../mock";

export default function modifyTask({
  option,
  setOption,
  selectedTask,
  setSelectedTask,
  setDisplayMoreOptions,
}: modifyTaskParams) {

  const initialTaskState: TaskModel = {
    Title: "",
    Description: "",
    Deadline: new Date(),
    Category: "",
    Status: false,
  };

  const [editedTask, setEditedTask] = useState<TaskModel>(
    selectedTask || initialTaskState
  );

  const saveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(editedTask);
  };

  

  return (
    <div className=" pt-4 pb-2 px-10 mx-2 absolute top-3 md:top-5 left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-xl h-[33.5rem] md:h-[95%] w-[90%] md:w-[50%] rounded-2xl">
      <div className=" w-[90%] px-4 py-2 border-b-2 border-dashed border-gray-500 ">
        <div
          className="cursor-pointer"
          onClick={() => {
            setDisplayMoreOptions(false);
            setSelectedTask(undefined);
          }}
        >
          <svg
            className="w-8 md:w-10 ml-auto text-right"
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

        <h1 className="font-bold font-serif text-3xl text-center ">
          {" "}
          {option === "Edit"
            ? "Edit Task"
            : option === "Details"
            ? "Task Details"
            : "Delete Task"}{" "}
        </h1>
      </div>

      <div className="h-[85%] overflow-y-scroll overflow-x-hidden pb-6 ">
        {selectedTask === undefined && (
          <p className="text-center text-xl pt-[14rem]">loading...</p>
        )}
        {selectedTask !== undefined &&
          (option === "Delete" || option === "Details") && (
            <>
              <dl
                className={`flex flex-col gap-2 px-4 ${
                  selectedTask.Description.length > 200
                    ? "mt-[1rem]"
                    : "mt-[2rem]"
                }`}
              >
                <div className="flex items-center  gap-[7rem] border border-gray-300 p-3">
                  <dt className="font-bold font-mono text-lg">Task Name:</dt>
                  <dd className="">{selectedTask.Title}</dd>
                </div>

                <div className="flex gap-[5.5rem] border border-gray-300  p-3">
                  <dt className="font-bold font-mono text-lg">Description:</dt>
                  <dd className="">{selectedTask.Description}</dd>
                </div>

                <div className="flex items-center  gap-[7.5rem] border border-gray-300  p-3">
                  <dt className="font-bold font-mono text-lg">Deadline:</dt>
                  <dd className="">{formatDate(selectedTask.Deadline)}</dd>
                </div>

                <div className="flex items-center  gap-[7.5rem] border border-gray-300  p-3  ">
                  <dt className="font-bold font-mono text-lg">Category:</dt>
                  <dd className=" ">{selectedTask.Category}</dd>
                </div>

                <div className="flex items-center  gap-[9rem] border border-gray-300  p-3">
                  <dt className="font-bold font-mono text-lg">Status:</dt>
                  <dd className="">
                    {selectedTask.Status == true ? "Completed" : "Pending"}
                  </dd>
                </div>
              </dl>

              {option === "Details" && (
                <div className="mt-4 flex items-center justify-between mr-4">
                  <p
                    className="underline text-red-500 cursor-pointer"
                    onClick={() => setOption("Delete")}
                  >
                    Delete Task
                  </p>
                  <p
                    className="text-blue-400 underline cursor-pointer"
                    onClick={() => setOption("Edit")}
                  >
                    Edit Task
                  </p>
                </div>
              )}

              {option === "Delete" && (
                <div className="flex mt-4 mr-4 justify-end">
                  <button className="bg-red-600 p-3  text-white w-[8rem] text-center reounded-xl">
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        {selectedTask !== undefined && option === "Edit" && (
          <div className="mx-auto">
            <form
              action=""
              onSubmit={saveChanges}
              className="flex flex-col gap-3 mt-5 md:mt-6 w-[90%] "
            >
              <div className="flex flex-col">
                <label className="text-lg font-medium">Project Title</label>
                <input
                  id="title"
                  placeholder="Enter Project Title"
                  defaultValue={selectedTask.Title}
                  onChange={(e) =>
                    setEditedTask((prev) => ({
                      ...prev,
                      Title: e.target.value,
                    }))
                  }
                  className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
                />
              </div>

              <div className="flex justify-between items-center">
                <div
                  className={`flex flex-col ${
                    selectedTask.Status ? "w-[100%]" : "w-[45%]"
                  }`}
                >
                  <label className="text-lg font-medium">
                    Project Deadline
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    defaultValue={
                      selectedTask.Deadline.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setEditedTask((prev) => ({
                        ...prev,
                        Deadline: new Date(e.target.value),
                      }))
                    }
                    placeholder="DD/MM/YYYY"
                    className="border border-gray-600 rounded-lg  outline-none py-2 px-4 w-full"
                  />
                </div>

                {!selectedTask.Status && (
                  <div className="w-[45%] relative checkBox-conatiner">
                    <label className="text-lg font-medium">Status</label>
                    <div className=" checkBox-tooltip bg-blue-600 text-white border border-white px-4 py-2 rounded-lg absolute">
                      <span>Check the box</span>
                    </div>
                    <div className="flex items-center justify-between border border-gray-600 rounded-lg py-2 px-4">
                      Completed
                      <input
                        type="checkbox"
                        id="status"
                        defaultChecked={selectedTask.Status}
                        onChange={(e) =>
                          setEditedTask((prev) => ({
                            ...prev,
                            Status: e.target.checked,
                          }))
                        }
                        className=" w-[10%] h-5 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-lg font-medium ">Description</label>
                <textarea
                  id="description"
                  defaultValue={selectedTask.Description}
                  onChange={(e) =>
                    setEditedTask((prev) => ({
                      ...prev,
                      Description: e.target.value,
                    }))
                  }
                  placeholder="Enter a description"
                  className="border border-gray-600 rounded-lg outline-none py-2 px-4 w-[100%] h-24"
                ></textarea>
              </div>

              <div>
                <label className="text-lg font-medium">Category</label>
                <select
                  id="category"
                  defaultValue={selectedTask.Category}
                  onChange={(e) =>
                    setEditedTask((prev) => ({
                      ...prev,
                      Category: e.target.value,
                    }))
                  }
                  name="category"
                  className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">work</option>
                  <option value="others">others</option>
                </select>
              </div>

              <div className="bg-black  text-white w-[8rem] py-4 text-center rounded-2xl ml-auto ">
                <button type="submit" className="">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
