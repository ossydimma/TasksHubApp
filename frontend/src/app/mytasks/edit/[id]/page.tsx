"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TaskModel, UserTaskType } from "../../../../../Interfaces";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {
  getApiErrorMessage,
  validateDeadline,
} from "../../../../../SharedFunctions";
import { taskApi } from "../../../../../services/apiServices/TaskApiService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MyButton from "@/app/components/MyButton";

export default function EditTaskPage() {
  const params = useParams();
  const taskId = params.id;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [task, setTask] = useState<UserTaskType | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const CategoryOptions = [
    { id: 2, label: "Work", value: "work" },
    { id: 3, label: "Personal", value: "personal" },
    { id: 4, label: "Others", value: "others" },
  ];

  const [editedTask, setEditedTask] = useState<TaskModel>({
    id: "",
    title: "",
    description: "",
    deadline: "",
    category: "",
    status: "",
  });

  /**
   * map update payload value from task and editedTask values
   * @return {UserTaskType} - return mapped payload
   */

  function mapPayload(): TaskModel {
    const payload: TaskModel = {
      id: editedTask.id,
      title: editedTask.title,
      description: editedTask.description,
      category: editedTask.category,
      deadline: editedTask.deadline,
      status: editedTask.status,
    };
    return payload;
  }

  /**
   * Validate all form inputs
   * @return {string | TaskModel} - return payload if no error
   */
  const validateForm = (): string | TaskModel => {
    if (!Object.values(editedTask).every((val) => val !== "")) {
      return "All field must be filled";
    }

    const payload = mapPayload();

    if (task?.deadline === editedTask.deadline) return payload;

    const deadlineError = validateDeadline(editedTask.deadline);
    if (deadlineError) {
      return deadlineError;
    }

    return payload;
  };

  const saveChanges = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation step
    const payload: TaskModel | string = validateForm();
    if (typeof payload === "string") {
      setErrorMessage(payload);
      return;
    }

    setIsLoading(true);

    try {
      await taskApi.updateTask(payload);

      // Success handling step
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/mytasks");
        setIsSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      //Error handling step
      const errorMsg = getApiErrorMessage(err);
      setErrorMessage(errorMsg);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getTask() {
      setIsLoading(true);

      try {
        const res = await taskApi.getTask(taskId);
        setTask(res);
        setEditedTask({
          id: res.id,
          title: res.title,
          deadline: res.deadline,
          description: res.description,
          category: res.category,
          status: res.status,
        });
      } catch (err) {
        console.error(err);
        setErrorMessage("An unexpected error occured, try reloading the page.");
      }
    }
    
    getTask();
  }, [taskId]);

  useEffect(() => {
    setIsLoading(false);
  }, [task]);

  if (!task) {
    return (
      <div className="py-4 sm:py-8 pb absolute left-1/2 top-4 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 z-10 bg-white shadow-xl w-[90%] md:w-[80%] lmd:w-[48%] rounded-3xl">
        {/* Header */}
        <div className="w-[80%] mx-auto px-4 py-2 border-b-2 border-dashed border-gray-500">
          <Skeleton height={30} width="60%" className="mx-auto" />
        </div>

        {/* Content */}
        <div className="h-[85%] w-[80%] mx-auto overflow-hidden overflow-x-hidden pb-6">
          <dl className="flex flex-col gap-2 sm:gap-3 mt-[2rem] text-sm sm:text-[1rem] italic">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-gray-300 p-3"
                >
                  <Skeleton width="30%" height={20} />
                  <Skeleton width="50%" height={20} />
                </div>
              ))}

            {/* Description */}
            <div className="flex flex-col gap-2 border border-gray-300 p-3">
              <Skeleton width="40%" height={20} />
              <div className="ml-6 flex flex-col gap-1">
                <Skeleton count={3} height={15} width="90%" />
              </div>
            </div>
          </dl>

          {/* Footer action */}
          <div className="mt-4 text-right">
            <Skeleton width={100} height={20} />
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-red-500 -mt-4">{errorMessage}</p>
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
                {CategoryOptions.map((cate) => (
                  <option key={cate.id} value={cate.value}>
                    {cate.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div
                className={`flex flex-col ${
                  task?.status === "Completed" ? "w-[100%]" : "w-[45%]"
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

              {task?.status !== "Completed" && (
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
                      defaultChecked={
                        editedTask.status !== "Completed" ? false : true
                      }
                      onChange={(e) => {
                        setEditedTask((prev) => ({
                          ...prev,
                          status:
                            e.target.checked === true
                              ? "Completed"
                              : task?.status ?? "",
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

            <div className=" sm:mt-2 ml-auto ">
              <MyButton label="Save Changes" type="submit" />
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
