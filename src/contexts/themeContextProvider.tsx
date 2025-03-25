import React, { createContext, useContext, useEffect, useState } from "react";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
   mode: ThemeMode;
   toggleTheme: (newTheme: ThemeMode) => void;
   isDark: boolean;
   isMdUp: boolean;
   isSmUp: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{
   children: React.ReactNode;
   mode: ThemeMode;
   setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}> = ({ children, mode, setMode }) => {
   // useEffect(() => {
   //    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

   //    const handleThemeChange = (e: MediaQueryListEvent) => {
   //       const newMode = e.matches ? "dark" : "light";
   //       setMode(newMode);
   //       localStorage.setItem("theme", newMode); // Save updated theme to localStorage
   //    };

   //    mediaQuery.addEventListener("change", handleThemeChange);
   //    return () => mediaQuery.removeEventListener("change", handleThemeChange);
   // }, []);

   useEffect(() => {
      localStorage.setItem("theme", mode);
   }, [mode]);

   const toggleTheme = (newTheme: any) => {
      setMode(newTheme);
   };

   const isMdUp = useMediaQuery("(min-width:960px)");
   const isSmUp = useMediaQuery("(min-width:600px)");
   const isDark = mode === "dark";

   return (
      <ThemeContext.Provider
         value={{ mode, toggleTheme, isDark, isMdUp, isSmUp }}
      >
         {children}
      </ThemeContext.Provider>
   );
};

export const useThemeContext = (): ThemeContextType => {
   const context = useContext(ThemeContext);
   if (!context) {
      throw new Error(
         "useThemeContext must be used within a ThemeContextProvider"
      );
   }
   return context;
};
