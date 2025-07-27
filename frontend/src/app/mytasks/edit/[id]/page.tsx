"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../../../services/axios";
import { TaskModel, UserTaskType } from "../../../../../Interfaces";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { getApiErrorMessage, validateDeadline } from "../../../../../SharedFunctions"
import { TaskApiService } from "../../../../../services/TaskApiService";

export default function EditTaskPage() {
  const params = useParams();
  const taskId = params.id;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [task, setTask] = useState<UserTaskType | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [editedTask, setEditedTask] = useState<TaskModel>({
    title: "",
    description: "",
    deadline: "",
    category: "",
    status: false,
  });

  async function getTask() {
    setIsLoading(true);

    try {
      const res = await api.get(`task/${taskId}`);
      setTask(res.data);
      setEditedTask(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  /**
   * Validate all input of task form
   * @return {string | null} - Error message if any is valid
   */
  const validateForm = (): string | null => {
    if (!Object.values(editedTask).every((val) => val !== "")) {
      return "All field must be filled";
    }

    const deadlineError = validateDeadline(editedTask.deadline);
    if (deadlineError) {
      return deadlineError;
    }

    return null;
  };

  const saveChanges = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation step
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await TaskApiService.updateTask(editedTask); //Api interaction step

      // Success handling step
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/mytasks");
        setIsSuccess(false);
      }, 2000);
    } catch (err: any) {
      //Error handling step
      const errorMsg = getApiErrorMessage(err);
      setErrorMessage(errorMsg);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTask();
  }, [taskId]);

  return (
    <main className="pb-[3.6rem] sm:pb-0 relative w-full h-full">
      {isLoading && (
        <div className="h-full w-full flex justify-center items-center">
          <LoadingSpinner
            styles={{
              svg: "h-6 w-6 sm:h-9 sm:w-9  lmd:h-6 lmd:w-6",
              span: "text-sm sm:text-[1.1rem] lmd:text-sm",
            }}
            text="Searching..."
          />
        </div>
      )}
      {isSuccess ? (
        <div
          className={`absolute -translate-x-1/2 left-1/2 top-4 bg-white shadow-xl py-5 px-12 border`}
        >
          Task updated
        </div>
      ) : (
        <div className="py-4 sm:pt-4 sm:pb absolute left-1/2 top-4 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 z-10 bg-white shadow-xl   w-[90%] md:w-[80%] lmd:w-[48%] rounded-3xl">
          <div className=" w-[80%]  mx-auto   px-4 py-2 sm:my-6 border-b-2 border-dashed border-gray-500 ">
            <h1 className="font-bold font-serif text-2xl sm:text-3xl text-center italic">
              Task Edit
            </h1>
          </div>
          <form
            action=""
            onSubmit={saveChanges}
            className="flex flex-col gap-3 sm:gap-4 mt-5 md:mt-8 w-[80%] mx-auto italic text-sm sm:text-[1rem]"
          >
            <p className="text-red-500">{errorMessage}</p>
            <div className="flex flex-col gap-1">
              <label className=" font-bold ">Title</label>
              <input
                id="title"
                placeholder="Enter Title"
                value={editedTask.title}
                onChange={(e) => {
                  setEditedTask((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                  setErrorMessage("");
                }}
                className="border border-gray-600 rounded-lg outline-none py-2 px-4  w-[100%]"
              />
            </div>

            <div>
              <label className=" font-bold ">Category</label>
              <select
                id="category"
                value={editedTask.category}
                onChange={(e) => {
                  setEditedTask((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                  setErrorMessage("");
                }}
                name="category"
                className="border border-gray-600 rounded-lg outline-none py-2 px-4 mt-1 w-[100%]"
              >
                <option value="Personal">Personal</option>
                <option value="Work">work</option>
                <option value="others">others</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div
                className={`flex flex-col ${
                  task?.status ? "w-[100%]" : "w-[45%]"
                }`}
              >
                <label className=" font-bold ">Deadline</label>
                <input
                  id="deadline"
                  type="date"
                  value={editedTask.deadline}
                  onChange={(e) => {
                    setEditedTask((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }));
                    setErrorMessage("");
                  }}
                  placeholder="DD/MM/YYYY"
                  className="border border-gray-600 rounded-lg mt-1 outline-none py-2 px-4 w-full"
                />
              </div>

              {!task?.status && (
                <div className="w-[45%] relative checkBox-conatiner">
                  <div className="w-[78%] text-center checkBox-tooltip bg-blue-600 -top-[1rem] text-white border border-white px-4 py-2 rounded-lg absolute">
                    <span>Check the box</span>
                  </div>
                  <label className=" font-bold ">Status</label>
                  <div className="flex items-center justify-between border border-gray-600 rounded-lg py-2 px-4 mt-1">
                    Completed
                    <input
                      type="checkbox"
                      id="status"
                      defaultChecked={editedTask.status}
                      onChange={(e) => {
                        setEditedTask((prev) => ({
                          ...prev,
                          status: e.target.checked,
                        }));
                        setErrorMessage("");
                      }}
                      className=" w-[10%] h-5 rounded-full cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className=" font-bold  ">Description</label>
              <textarea
                id="description"
                value={editedTask.description}
                onChange={(e) => {
                  setEditedTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  setErrorMessage("");
                }}
                placeholder="Enter a description"
                className="border border-gray-600 rounded-lg outline-none py-2 px-4 w-[100%] mt-1 h-24"
              ></textarea>
            </div>

            <div className="bg-black  text-white px-4 py-3 text-center rounded-2xl sm:mt-2 ml-auto ">
              <button type="submit" className="">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
