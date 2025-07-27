import { TaskModel } from "../Interfaces";
import { api } from "./axios";

interface TaskService {
    updateTask(payload: TaskModel) : Promise<any>;
}

export const TaskApiService: TaskService = {

    updateTask: async(payload: TaskModel) => {
        await api.put("task/update", payload)
    }

}