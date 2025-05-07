"use client";

import { useState } from "react";

export default function page() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <main className="">
      <div className=" pt-8 pb px-10 mx-2 absolute  left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-xl h-[33.5rem] md:h-[95%] top-3 md:top-5  w-[90%] md:w-[45%] rounded-2xl ">
        <div className=" w-[90%] px-4 py-2 border-b-2 border-dashed border-gray-500 ">
          <h1 className="font-bold font-serif text-3xl text-center ">
            Create Task
          </h1>
        </div>

        <div className=" w-[90%]  h-[87%] mx-auto overflow-y-scroll">
          <form
            action=""
            method="post"
            className="flex flex-col gap-2.5 sm:gap-3.5 mt-5 md:mt-8 w-[90%] "
          >
            <p className="text-red-500">{errorMessage}</p>

            <div className="flex flex-col">
              <label className="text-lg font-medium">Project Title</label>
              <input
                id="title"
                placeholder="Enter Project Title"
                className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-medium">Project Deadline</label>
              <input
                id="deadline"
                type="date"
                placeholder="DD/MM/YYYY"
                className="border border-gray-600 rounded-lg  outline-none py-2 px-4 w-[100%]"
              />
            </div>

            <div>
              <textarea
                id="description"
                placeholder="Enter a description"
                className="border border-gray-600 rounded-lg outline-none py-2 px-4 w-[100%] h-20 sm:h-24"
              />
            </div>

            <div>
              <label className="text-lg font-medium">Category</label>
              <select
                id="category"
                name="category"
                className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
              >
                <option value="ersonal project">Personal project</option>
                <option value="work project">work project</option>
                <option value="others">others</option>
              </select>
            </div>

            <div className="bg-black  text-white w-[8rem] py-4 text-center rounded-2xl ml-auto ">
              <button type="submit">Create Task</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
