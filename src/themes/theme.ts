import { createTheme, Theme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { MuiInputBase } from "./components/input-base";
import { MuiButton } from "./components/buttons";
import { MuiAutocomplete } from "./components/autocomplete";

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
               light: "#e65130",
               main: "#ff2e63",
               dark: "#c51162",
               contrastText: "#fff",
            },
            info: {
               light: "#042861",
               main: "#061835",
               dark: "#03000e",
               contrastText: "#fff",
            },
            success: {
               light: "#faa77b",
               main: "#de601d",
               dark: "#2e0904",
               contrastText: "#fff",
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
            MuiAutocomplete,
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
