
export interface User {
    // id : string; 
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

export interface UserTask {
    Id : string;
    Title : string;
    Description : string;
    Category : string;
    Deadline : Date;
    Status : boolean;
}

export interface modifyTaskParams {
    option : "Details" | "Edit" | "Delete" | undefined;
    setOption : (value : "Details" | "Edit" | "Delete" | undefined) => void;
    selectedTask : UserTask | undefined;
    setSelectedTask : (value : UserTask | undefined) => void;
    setDisplayMoreOptions : (value : boolean) => void;
}

export interface TaskModel {
    Title: string | undefined;
    Description: string | undefined;
    Deadline: Date | undefined;
    Category: string | undefined;
    Status: boolean | undefined;
}

export interface FilterByType {
    allTask : boolean;
    status : string | undefined;
    deadline : Date | undefined;
    category : string | undefined;
}

export interface DocummentType {
    id : string;
    title : string;
    content : string;
    formattedDate : string;
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
    confirmPassword : string;
}

export interface AuthContextType {
    accessToken : string | null;
    isAuthenticated : boolean;
    setAccessToken : (token : string) => void;
    logout : () => void;
    userInfo : User | null
    setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
}
