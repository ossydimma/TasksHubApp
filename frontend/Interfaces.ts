// import { formatDate } from "../mock";

export interface User {
    id : string; 
    fullName : string;
    userName : string;
    email : string;
    imageSrc : string;   
}

export interface SignupModelType {
    fullName : string;
    email : string;
    password : string;
    
}

export interface LoginModelType {
    email : string;
    password : string;
    rememberMe : boolean;
}
export interface NavBarToolTips {
    createTask : boolean;
    home : boolean;
    myTask : boolean;
    documentation : boolean;
    setting : boolean;
    logOut : boolean;
}

export interface UserTaskType {
    id : string;
    title : string;
    description : string;
    creationDate: string;
    category : string;
    deadline : string;
    status : string;
}

export interface modifyTaskParams {
    option : "Details" | "Edit" | "Delete" | undefined;
    setOption : (value : "Details" | "Edit" | "Delete" | undefined) => void;
    selectedTask : UserTaskType | undefined;
    setSelectedTask : (value : UserTaskType | undefined) => void;
    setDisplayMoreOptions : (value : boolean) => void;
}

export interface TaskModel {
    id: string
    title: string;
    description: string;
    deadline: string;
    category: string;
    status: string;
}

export interface FilterTaskType {
    deadline: string | null;
    created: string | null;
    category: string | null;
    status: string | null;
}

export interface DocumentType {
    id : string;
    title : string;
    content : string;
    date : string;
    isHovered : boolean;
}

export interface EyeIconType {
    showPassword : boolean;
    handlePasswordType : () => void;
}

export interface PasswordType {
    newPassword : "password" | "text";
    confirmPassword : "password" | "text";
}

export interface ShowPasswordType {
    newPassword : boolean;
    confirmPassword : boolean;
}

export interface PasswordValueType {
    oldPassword : string;
    newPassword : string;
    // confirmPassword : string;
}

export interface AuthContextType {
    accessToken : string | null;
    isAuthenticated : boolean;
    setAccessToken : (token : string) => void;
    logout : () => void;
    userInfo : User | null
    setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NavContextType {
    isMaximized: boolean;
    setIsMaximized: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DocumentInputType{
    id: string;
    title: string;
    body: string;
}

export interface TaskValuesType {
  title: string,
  deadline: string,
  description: string,
  category: string
}

export interface DataCountsType {
    totalTasks: number;
    documents: number;
    overdueTasks: number;
    todaysTasks: number
}

export interface TasksCarousel {
    id: string;
    title: string;
    category: string;
    status: string;
    deadline: string:
}

export interface GroupTasksCarousel {
    allTasks: TasksCarousel;
    overduewTasks: TasksCarousel;
    todaysTasks: TasksCarousel;
}