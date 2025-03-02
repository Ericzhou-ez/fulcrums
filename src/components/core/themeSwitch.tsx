import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { Sun, Moon, Desktop } from "phosphor-react";

interface ThemeToggleProps {
   currentTheme: string;
   handleToggleTheme: any;
}

const Container = styled("div")(({ theme }) => ({
   borderRadius: 9999,
   padding: 3,
   border: "1px solid " + theme.palette.divider,
}));

const ButtonGroup = styled("div")({
   display: "flex",
});

const CircleButton = styled("button")<{
   isSelected?: boolean;
   isDarkMode?: boolean;
}>(({ theme, isSelected, isDarkMode }) => ({
   borderRadius: "50%",
   height: "30px",
   margin: 0,
   border: "none",
   display: "inline-flex",
   alignItems: "center",
   justifyContent: "center",
   cursor: "pointer",
   backgroundColor: isSelected
      ? isDarkMode
         ? "#555" 
         : "#bbb"
      : "transparent",

   "&:hover": {
      backgroundColor: isSelected
         ? isDarkMode
            ? "#6668" 
            : "#9998" 
         : isDarkMode
         ? "#444" 
         : "#ddd3", 
   },

   [theme.breakpoints.down("md")]: {
      height: "24px",
   },
}));

const ThemeToggle: React.FC<ThemeToggleProps> = ({
   currentTheme,
   handleToggleTheme,
}) => {
   const isSystemDark = useMediaQuery("(prefers-color-scheme: dark)");

   const handleButtonClick = (selectedTheme: "light" | "dark" | "system") => {
      const newTheme =
         selectedTheme === "system"
            ? isSystemDark
               ? "dark"
               : "light"
            : selectedTheme;

      if (newTheme === currentTheme) return;

      handleToggleTheme(newTheme);
   };
   const isAppDarkMode = currentTheme === "dark";
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";

   return (
      <Container>
         <ButtonGroup>
            <CircleButton
               isSelected={currentTheme === "light"}
               isDarkMode={isAppDarkMode}
               onClick={() => handleButtonClick("light")}
               aria-label="light mode"
            >
               <Sun size={18} color={isDark ? "#ccc" : "#111"} />
            </CircleButton>

            <CircleButton
               isSelected={false}
               isDarkMode={isAppDarkMode}
               onClick={() => handleButtonClick("system")}
               aria-label="system mode"
            >
               <Desktop size={18} color={isDark ? "#ccc" : "#111"} />
            </CircleButton>

            <CircleButton
               isSelected={currentTheme === "dark"}
               isDarkMode={isAppDarkMode}
               onClick={() => handleButtonClick("dark")}
               aria-label="dark mode"
            >
               <Moon size={18} color={isDark ? "#ccc" : "#111"} />
            </CircleButton>
         </ButtonGroup>
      </Container>
   );
};

export default ThemeToggle;
