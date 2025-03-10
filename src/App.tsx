import React, { useMemo, useState, useEffect, SetStateAction } from "react";
import {
   createTheme,
   ThemeProvider,
   CssBaseline,
   Container,
   Typography,
} from "@mui/material";
import Nav from "./components/core/nav";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Footer from "./components/core/footer";
import { auth } from "./configs/firebase";
import Dashboard from "./pages/dashboard/dashboard";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router";
import Loading from "./components/core/loading";
import ScrollToTop from "./components/core/scrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { ThemeContextProvider } from "./contexts/themeContextProvider";

declare module "@mui/material/styles" {
   interface TypeBackground {
      secondary: string;
   }
}

function App() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(true);
   const [mode, setMode] = useState<"light" | "dark">(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
         return savedTheme;
      }
      return "light";
   });

   const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
   };

   const theme = useMemo(
      () =>
         createTheme({
            palette: {
               mode,
               primary: {
                  main: "#f57c31",
               },
               secondary: {
                  main: "#f5bf46",
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
         }),
      [mode]
   );

   useEffect(() => {
      // Sync all theme colors to CSS variables
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
   }, [theme]);

   return (
      <ThemeProvider theme={theme}>
         <ThemeContextProvider mode={mode} setMode={setMode}>
            <Analytics />
            <CssBaseline />
            <BrowserRouter>
               <ScrollToTop />

               {loading && <Loading />}

               <AppRoutes
                  loading={loading}
                  setLoading={setLoading}
                  toggleModal={toggleModal}
                  isModalOpen={isModalOpen}
               />
            </BrowserRouter>
         </ThemeContextProvider>
      </ThemeProvider>
   );
}

export default App;
