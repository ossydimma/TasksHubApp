import { TaskModel } from "../Interfaces";
import { api } from "./axios";

interface TaskService {
    updateTask(payload: TaskModel) : Promise<any>;
    getTask(taskId: string | string[] | undefined): Promise<any>;
    deleteTask(taskId: string | string[] | undefined): Promise<any>;
}

export const TaskApiService: TaskService = {

    updateTask: async(payload: TaskModel) => {
        await api.put("task/update", payload)
    },

    getTask: async(taskId: string) => {
        const res = await api.get(`task/${taskId}`);
        return res.data;
    },

    deleteTask: async(taskId: string) => {
        await api.delete(`task/${taskId}`)
    }
}