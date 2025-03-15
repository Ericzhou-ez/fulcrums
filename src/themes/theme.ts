import { createTheme, Theme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { MuiInputBase } from "./components/input-base";
import { MuiButton } from "./components/buttons";

export function useAppTheme(mode: "light" | "dark"): Theme {
   const theme = useMemo(() => {
      return createTheme({
         palette: {
            mode,
            primary: {
               light: "#fb9c0c",
               main: "#f57c31",
               dark: "#fe4011",
               contrastText: "#fff",
            },
            secondary: {
               light: "#ffe587",
               main: "#f5bf46",
               dark: "#de7101",
               contrastText: "#000",
            },
            background: {
               default: mode === "light" ? "#ffffff" : "#121212",
               secondary: mode === "light" ? "#f7f7f7" : "#1e1e1e",
            },
            text: {
               primary: mode === "light" ? "#000000" : "#ffffff",
               secondary: mode === "light" ? "#555555" : "#cccccc",
            },
         },
         typography: {
            fontFamily: "Oxygen, Helvetica, Arial, sans-serif",
         },
         components: {
            MuiInputBase,
            MuiButton,
         },
      });
   }, [mode]);

   useEffect(() => {
      const { primary, secondary, background, text } = theme.palette;
      document.documentElement.style.setProperty(
         "--primary-color",
         primary.main
      );
      document.documentElement.style.setProperty(
         "--secondary-color",
         secondary.main
      );
      document.documentElement.style.setProperty(
         "--background-color",
         background.default
      );
      document.documentElement.style.setProperty(
         "--background-secondary-color",
         background.secondary
      );
      document.documentElement.style.setProperty(
         "--text-primary-color",
         text.primary
      );
      document.documentElement.style.setProperty(
         "--text-secondary-color",
         text.secondary
      );
      document.documentElement.style.setProperty(
         "--primary-light-color",
         primary.light
      );
      document.documentElement.style.setProperty(
         "--primary-dark-color",
         primary.dark
      );
      document.documentElement.style.setProperty(
         "--primary-contrast-color",
         primary.contrastText
      );
      document.documentElement.style.setProperty(
         "--secondary-light-color",
         secondary.light
      );
      document.documentElement.style.setProperty(
         "--secondary-dark-color",
         secondary.dark
      );
      document.documentElement.style.setProperty(
         "--secondary-contrast-color",
         secondary.contrastText
      );
   }, [theme]);

   return theme;
}
