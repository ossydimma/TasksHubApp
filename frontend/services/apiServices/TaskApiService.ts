import { FilterTaskType, TaskModel, TaskValuesType } from "../../Interfaces";
import { api } from "../axios";

interface TaskService {
    createTask(values: TaskValuesType): Promise<any>;
    updateTask(payload: TaskModel) : Promise<any>;
    getAllTasks() : Promise<any>;
    getCarouselTasks(): Promise<any>;
    getTask(taskId: string | string[] | undefined): Promise<any>;
    filterTask(payload : FilterTaskType): Promise<any>
    deleteTask(taskId: string | string[] | undefined): Promise<any>;
}

export const taskApi: TaskService = {

    createTask: async(values: TaskValuesType) => {
        await api.post("task/create", values);
    },

    updateTask: async(payload: TaskModel) => {
        await api.put("task/update", payload)
    },

    getAllTasks: async() => {
    const res = await api.get("/task/get-tasks");
      return res.data.tasks;
    },

    getTask: async(taskId: string) => {
        const res = await api.get(`task/${taskId}`);
        return res.data;
    },

    getCarouselTasks: async() => {
        const res = await api.get("/task/get-carousel-tasks");
        return res.data;
    },

    filterTask: async(payload: FilterTaskType) => {
        const res = await api.post('task/filter-tasks', payload);
        return res.data.tasks;
    },

    deleteTask: async(taskId: string) => {
        await api.delete(`task/${taskId}`)
    }

    
}