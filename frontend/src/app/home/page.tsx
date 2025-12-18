"use client";
import DataDetailCard from ".././components/DataDetailCard";
import Calendar from "react-calendar";
import Header from ".././components/header";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { SettingsServices } from "../../../services/apiServices/SettingsService";
import { taskApi } from "../../../services/apiServices/TaskApiService";
import { DataCountsType, GroupTasksCarousel } from "../../../Interfaces";
import TaskCarousel from "../components/TasksCarousel";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [date, setDate] = useState<Date | null>(null);
  const [dataCounts, setDataCounts] = useState<DataCountsType | null>(null);
  const [tasks, setTasks] = useState<GroupTasksCarousel | null>(null)


  const getCounts = async () => {
    try {
      const res = await SettingsServices.getUserDataCounts();
      setDataCounts(res.data);
    } catch (err) {
      console.error(err)
    }
  };

  const getTaskInGroup = async () => {
    try {
      const res = await taskApi.getCarouselTasks();
      setTasks(res);
    } catch (err) {
      console.error(err)
    }
  };

    const navigateToTasksPage = () => {
    router.push("/mytasks");
  };

  const navToTaskPageWithFiltering = (by: string) => {
    const url = `/mytasks?filter=${by}`;
    router.push(url);
  };

  const handleDisplayData = (type: string) => {
    switch (type) {
      case "Overdue Tasks":
        navToTaskPageWithFiltering("overdue");
        break;
      case "Today's Task":
        navToTaskPageWithFiltering("todays");
        break;
      case "Total Tasks":
        navigateToTasksPage();
        break;
      case "Documents":
        router.push("/documentation");
        break;
    }
  };

  useEffect(()=> {
    getCounts();
    getTaskInGroup();
    setDate(new Date());
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading]);

  return (
    <main className="text-black mb-[5.5rem] sm:mb-[1.5rem] md:mb-0">
      <Header />
      <div className={`mt-5`}>
        <DataDetailCard counts={dataCounts} />
      </div>


      <section className={`flex flex-col md:flex-row justify-between w-full px-4 lmd:px-10 mt-3 md:mt-5 `}>
        <TaskCarousel tasks={tasks} handleDisplayData={handleDisplayData} />
        <div className={`w-full md:w-[40%] h-full`}>
          <Calendar   
            // onChange={(e) => {
            //   console.log("hello", e);
            // }}
            value={date}
            className=" py-10 px-4 rounded-2xl  mx-2 md:mx-0 h-full"
          />
        </div>
        
      </section>
      
    </main>
  );
}
