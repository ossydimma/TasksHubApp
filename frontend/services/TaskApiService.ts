import { TaskModel } from "../Interfaces";
import { api } from "./axios";

interface TaskService {
    updateTask(payload: TaskModel) : Promise<any>;
    getTaskById(taskId: string | string[] | undefined): Promise<any>;
}

export const TaskApiService: TaskService = {

    updateTask: async(payload: TaskModel) => {
        await api.put("task/update", payload)
    },

    getTaskById: async(taskId: string) => {
        const res = await api.get(`task/${taskId}`);
        return res.data;
    }

}