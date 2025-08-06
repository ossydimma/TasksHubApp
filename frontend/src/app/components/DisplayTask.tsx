"use client";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../services/axios";
import { UserTaskType } from "../../../Interfaces";
import { taskApi } from "../../../services/TaskApiService";
import { formatDate } from "../../../SharedFunctions";

export default function DisplayTask() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const taskId = params.id;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [task, setTask] = useState<UserTaskType>({} as UserTaskType);
  const [validate, setValidate] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);

  const DeletePage = pathname.includes("delete");

  const successfulDeletion = () => {
    setIsLoading(false);
    setDeleted(true);
      setTimeout(() => {
        router.push("/mytasks");
      }, 2000);
  }

  async function deleteTask() {
    setIsLoading(true);

    try {
      await taskApi.deleteTask(taskId);
      successfulDeletion();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function getTask() {
    setIsLoading(true);

    try {
      const res = await taskApi.getTask(taskId);
      setTask(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

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
      {DeletePage && validate && (
        <div
          className={`px-6 bg-red-600 border w-full sm:w-auto  h-fit py-10 flex flex-col gap-4 justify-center items-center rounded-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
        >
          <p className=" text-center text-xl text-white font-mono italic font-semibold">
            Are you sure you want to delete this task?
          </p>
          <div className="w-full flex justify-evenly mt-4 items-center">
            <button
              className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
              onClick={() => {
                setValidate(!validate);
                deleteTask();
              }}
            >
              Yes
            </button>
            <button
              className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
              onClick={() => setValidate(!validate)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {deleted ? (
        <div
          className={`absolute -translate-x-1/2 left-1/2 top-4 bg-white shadow-xl py-5 px-12 border`}
        >
          Task deleted
        </div>
      ) : (
        <div className="py-4 sm:py-8 pb absolute left-1/2 top-4 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 z-10 bg-white shadow-xl w-[90%] md:w-[80%] lmd:w-[48%] rounded-3xl">
          <div className=" w-[80%]  mx-auto  px-4 py-2 border-b-2 border-dashed border-gray-500 ">
            <h1 className="font-bold font-serif text-2xl sm:text-3xl text-center italic">
              {DeletePage ? "Delete Task" : "Task Details"}
            </h1>
          </div>
          <div className="h-[85%] w-[80%] mx-auto overflow-hidden overflow-x-hidden pb-6">
            <dl
              className={`flex flex-col gap-2 sm:gap-3  ${task?.description?.length > 110 ? "mt-2 sm:mt-[1.5rem]" : "mt-[2rem]"}  text-sm sm:text-[1rem] italic`}
            >
              <div className="flex items-center justify-between border border-gray-300 p-3">
                <dt className="font-bold">Task Name:</dt>
                <dd className="uppercase">{task?.title}</dd>
              </div>

              <div className="flex items-center  justify-between border border-gray-300  p-3  ">
                <dt className="font-bold ">Category:</dt>
                <dd className=" ">{task?.category}</dd>
              </div>

              <div className="flex items-center  justify-between border border-gray-300  p-3">
                <dt className="font-bold ">Created_at:</dt>
                <dd className="">{formatDate(task?.creationDate)}</dd>
              </div>

              <div className="flex items-center  justify-between border border-gray-300  p-3">
                <dt className="font-bold ">Deadline:</dt>
                <dd className="">{formatDate(task?.deadline)}</dd>
              </div>

              <div className="flex items-center  justify-between border border-gray-300  p-3">
                <dt className="font-bold ">Status:</dt>
                <dd className="">
                  {task?.status}
                </dd>
              </div>

              <div className="flex flex-col gap-1 border border-gray-300  p-3">
                <dt className="font-[900] ">Description:</dt>
                <dd className="ml-6 text-sm">{task?.description}</dd>
              </div>
            </dl>

            <div className="mt-4 text-right">
              {DeletePage && !validate && (
                <p
                  className={`underline text-red-500 cursor-pointer`}
                  onClick={() => setValidate(true)}
                >
                  Delete Task
                </p>
              )}

              {!DeletePage && (
                <p
                  className="text-blue-400 underline cursor-pointer"
                  onClick={() => router.push(`/mytasks/edit/${taskId}`)}
                >
                  Edit Task
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
