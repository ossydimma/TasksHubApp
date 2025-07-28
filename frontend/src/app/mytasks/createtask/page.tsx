"use client";

import { useState, useEffect } from "react";
import type { TaskValuesType } from "../../../../Interfaces";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { api } from "../../../../services/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import {
  getApiErrorMessage,
  validateDeadline,
} from "../../../../SharedFunctions";
import { taskApi } from "../../../../services/TaskApiService";

export default function page() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [taskValues, setTaskValues] = useState<TaskValuesType>({
    title: "",
    deadline: "",
    description: "",
    category: "personal",
  });

  const successfulApiCall = () => {
    setTaskValues((prev) => ({
      ...prev,
      title: "",
      deadline: "",
      description: "",
    }));

    setTimeout(() => {
      setMessage("Tasks created successfully");
    }, 3000);

    setMessage(""); 
    router.push("/mytasks");
  };

  /**
   * Validate all form inputs
   * @return {string | null} - Error message if any is vallid else return null
   */
  const validateForm = (): string | null => {
    const emptyFields = Object.entries(taskValues)
      .filter(([key, value]) => value === "")
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      return `Please fill in: ${emptyFields.join(", ")}`;
    }

    if (taskValues.description.length > 200 && taskValues.description.length < 3) {
      return "Description should be above 200 or below 3 characters. ";
    }

    const deadlineError = validateDeadline(taskValues.deadline);
    if (deadlineError) {
      return deadlineError
  }
    return null;
  };

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError){
      setMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await taskApi.createTask(taskValues);

      successfulApiCall();
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err);
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }

    console.log(taskValues);
  }

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading]);

  return (
    <main className="pb-[3.6rem] sm:pb-0 relative w-full h-full">
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
      <div className="py-4 sm:py-8 pb absolute left-1/2 top-4 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 z-10 bg-white shadow-xl   w-[90%] md:w-[80%] lmd:w-[48%] rounded-3xl">
        <div className=" w-[80%] lmd:w-[70%] mx-auto  px-4 py-2 border-b-2 border-dashed border-gray-500 ">
          <h1 className="font-bold font-serif text-2xl sm:text-3xl text-center italic">
            Create Task
          </h1>
        </div>

        <div className=" w-[80%] lmd:w-[70%] mx-auto ">
          <p
            className={`${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            } my-2 italic text-sm sm:text-[1rem]`}
          >
            {message}{" "}
          </p>
          <form
            action=""
            method="post"
            onSubmit={handleSubmit}
            className={`flex flex-col gap-2.5 ${
              message ? " mt-0 sm:mt-5 " : "mt-6"
            } `}
          >
            <div className="flex flex-col">
              <label className="text-[1rem] sm:text-lg font-semibold italic ml-2 font-">
                Title
              </label>
              <input
                id="title"
                placeholder="Enter Project Title"
                value={taskValues.title}
                onChange={(e) => {
                  setMessage("");
                  setTaskValues((prev) => ({ ...prev, title: e.target.value }));
                }}
                className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
              />
            </div>
            <div>
              <label className="text-[1rem] sm:text-lg font-semibold italic ml-2 font-">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={taskValues.category}
                onChange={(e) => {
                  setMessage("");
                  setTaskValues((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                }}
                className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
              >
                <option value="personal">Personal project</option>
                <option value="work">work project</option>
                <option value="others">others</option>
              </select>
            </div>
            <div className="flex flex-col mb-2">
              <label className="text-[1rem] sm:text-lg font-semibold italic ml-2 font-">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                placeholder="DD/MM/YYYY"
                value={taskValues.deadline}
                onChange={(e) => {
                  setMessage("");
                  setTaskValues((prev) => ({
                    ...prev,
                    deadline: e.target.value,
                  }));
                }}
                className="border border-gray-600 rounded-lg  outline-none py-2 px-4 w-[100%]"
              />
            </div>
            <div>
              <textarea
                id="description"
                placeholder="Enter a description"
                value={taskValues.description}
                onChange={(e) => {
                  setMessage("");
                  setTaskValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
                className="border border-gray-600 rounded-lg outline-none py-2 px-4 w-[100%] h-20 sm:h-24"
              />
            </div>
            <div className="ml-auto ">
              <button
                type="submit"
                className="bg-black  text-white w-[8rem] py-4 text-center rounded-2xl "
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
