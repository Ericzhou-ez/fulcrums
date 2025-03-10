import { createContext } from "react";
import React from "react";

interface DataContextProps {}

interface DataContextProviderProps {
   children: React.ReactNode;
}

const DataContext = createContext<DataContextProps | null>(null);

export const DataContextProvider: React.FC<DataContextProviderProps> = ({
   children,
}) => {
   
   return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};
