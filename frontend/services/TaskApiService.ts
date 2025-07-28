import { TaskModel, TaskValuesType } from "../Interfaces";
import { api } from "./axios";

interface TaskService {
    createTask(values: TaskValuesType): Promise<any>;
    updateTask(payload: TaskModel) : Promise<any>;
    getTask(taskId: string | string[] | undefined): Promise<any>;
    deleteTask(taskId: string | string[] | undefined): Promise<any>;
}

export const taskApi: TaskService = {

    createTask: async(values: TaskValuesType) => {
        await api.post("task/create", values);
    },

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