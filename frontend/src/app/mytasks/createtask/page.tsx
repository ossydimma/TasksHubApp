"use client";

import { useState } from "react";
import type {TaskValuesType} from "../../../../Interfaces"


export default function page() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [taskValues, setTaskValues] = useState<TaskValuesType>({
    title : "",
    deadline: "",
    description: "",
    category: "personal"
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const emptyFields = Object.entries(taskValues)
      .filter(([key, value]) => value === "")
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      setErrorMessage(`Please fill in: ${emptyFields.join(", ")}`);
      return;
    }

    try {

    } catch (err: any) {

    }


    console.log(taskValues);
  }


  return (
    <main className="pb-[3.6rem] sm:pb-0 relative w-full h-full">
      <div className="py-4 sm:py-8 pb absolute left-1/2 top-4 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 z-10 bg-white shadow-xl   w-[90%] md:w-[80%] lmd:w-[48%] rounded-3xl" >
        <div className=" w-[80%] lmd:w-[70%] mx-auto  px-4 py-2 border-b-2 border-dashed border-gray-500 ">
          <h1 className="font-bold font-serif text-2xl sm:text-3xl text-center italic">
            Create Task
          </h1>
        </div>

        <div className=" w-[80%] lmd:w-[70%] mx-auto ">
          <p className="text-red-500 mt-2">{errorMessage} </p>
          <form
            action=""
            method="post"
            onSubmit={handleSubmit}
            className={`flex flex-col gap-2.5 ${errorMessage ? " mt-0 sm:mt-5 " : "mt-6" } `}
          >

            <div className="flex flex-col">
              <label className="text-[1rem] sm:text-lg font-semibold italic ml-2 font-">Title</label>
              <input
                id="title"
                placeholder="Enter Project Title"
                value={taskValues.title}
                onChange={(e) =>{setErrorMessage(""); setTaskValues((prev)=> ({...prev, title: e.target.value}))}}
                className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
              />
            </div>

            <div>
              <label className="text-[1rem] sm:text-lg font-semibold italic ml-2 font-">Category</label>
              <select
                id="category"
                name="category"
                value={taskValues.category}
                onChange={(e) => {setErrorMessage(""); setTaskValues((prev)=> ({...prev, category: e.target.value}))}}
                className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
              >
                <option value="personal">Personal project</option>
                <option value="work">work project</option>
                <option value="others">others</option>
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <label className="text-[1rem] sm:text-lg font-semibold italic ml-2 font-">Deadline</label>
              <input
                id="deadline"
                type="date"
                placeholder="DD/MM/YYYY"
                value={taskValues.deadline}
                onChange={(e) => {setErrorMessage(""); setTaskValues((prev)=> ({...prev, deadline: e.target.value}))}}
                className="border border-gray-600 rounded-lg  outline-none py-2 px-4 w-[100%]"
              />
            </div>

            <div>
              <textarea
                id="description"
                placeholder="Enter a description"
                value={taskValues.description}
                onChange={(e) => {setErrorMessage(""); setTaskValues((prev)=> ({...prev, description: e.target.value}))}}
                className="border border-gray-600 rounded-lg outline-none py-2 px-4 w-[100%] h-20 sm:h-24"
              />
            </div>
Richard branson 
            <div className="ml-auto ">
              <button type="submit" className="bg-black  text-white w-[8rem] py-4 text-center rounded-2xl ">Create</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
