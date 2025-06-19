import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { Sun, Moon, Desktop } from "phosphor-react";
import { useThemeContext } from "../../contexts/themeContextProvider";

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
   backgroundColor: isSelected ? (isDarkMode ? "#555" : "#bbb") : "transparent",

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

const ThemeSwitch: React.FC = () => {
   const { mode, setMode, effectiveMode } = useThemeContext();
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";

   const handleButtonClick = (selectedTheme: "light" | "dark" | "system") => {
      if (selectedTheme === mode) return;
      setMode(selectedTheme);
   };

   return (
      <Container>
         <ButtonGroup>
            <CircleButton
               isSelected={mode === "light"}
               isDarkMode={effectiveMode === "dark"}
               onClick={() => handleButtonClick("light")}
               aria-label="light mode"
            >
               <Sun size={18} color={isDark ? "#ccc" : "#111"} />
            </CircleButton>

            <CircleButton
               isSelected={mode === "system"}
               isDarkMode={effectiveMode === "dark"}
               onClick={() => handleButtonClick("system")}
               aria-label="system mode"
            >
               <Desktop size={18} color={isDark ? "#ccc" : "#111"} />
            </CircleButton>

            <CircleButton
               isSelected={mode === "dark"}
               isDarkMode={effectiveMode === "dark"}
               onClick={() => handleButtonClick("dark")}
               aria-label="dark mode"
            >
               <Moon size={18} color={isDark ? "#ccc" : "#111"} />
            </CircleButton>
         </ButtonGroup>
      </Container>
   );
};

export default ThemeSwitch;
