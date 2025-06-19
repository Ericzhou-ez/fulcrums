import React, { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
   mode: ThemeMode; 
   setMode: (mode: ThemeMode) => void;
   effectiveMode: "light" | "dark"; 
   isDark: boolean;
   isMdUp: boolean;
   isSmUp: boolean;
   isPhoneUp: boolean;
   toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{
   children: React.ReactNode;
   mode: ThemeMode;
   setMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
}> = ({ children, mode, setMode }) => {
   const isSystemDark = useMediaQuery("(prefers-color-scheme: dark)");
   const [effectiveMode, setEffectiveMode] = useState<"light" | "dark">(() => {
      if (mode === "system") {
         return isSystemDark ? "dark" : "light";
      }
      return mode;
   });

   useEffect(() => {
      if (mode === "system") {
         setEffectiveMode(isSystemDark ? "dark" : "light");
      } else {
         setEffectiveMode(mode);
      }
   }, [mode, isSystemDark]);

   useEffect(() => {
      localStorage.setItem("theme", mode);
   }, [mode]);

   const toggleTheme = () => {
      if (mode === "system") {
         setMode(isSystemDark ? "light" : "dark");
      } else if (mode === "light") {
         setMode("dark");
      } else if (mode === "dark") {
         setMode("light");
      }
   };

   const isMdUp = useMediaQuery("(min-width:960px)");
   const isSmUp = useMediaQuery("(min-width:600px)");
   const isPhoneUp = useMediaQuery("(min-width:480px)");
   const isDark = effectiveMode === "dark";

   return (
      <ThemeContext.Provider
         value={{
            mode,
            setMode,
            effectiveMode,
            isDark,
            isMdUp,
            isSmUp,
            isPhoneUp,
            toggleTheme,
         }}
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
