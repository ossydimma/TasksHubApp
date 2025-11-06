"use client"
import { createContext, useContext, useState } from "react";
import { NavContextType } from "../Interfaces";

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isMaximized, setIsMaximized] = useState<boolean>(true);

    return (
        <NavContext.Provider value={{isMaximized, setIsMaximized}}>
            {children}
        </NavContext.Provider>
    );
};

export const useNav = () => {
    const context = useContext(NavContext);
    if (!context) {
        throw new Error("useNav must be used within a NavProvider");
    }

    return context;
}

