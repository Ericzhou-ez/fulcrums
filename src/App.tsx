import React, { useMemo, useState, useEffect } from "react";
import {
   createTheme,
   ThemeProvider,
   CssBaseline,
   Container,
   Typography,
} from "@mui/material";
import Nav from "./components/nav";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Footer from "./components/footer";
import { auth } from "./configs/firebase";
import Dashboard from "./pages/dashboard";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router";
import Loading from "./components/loading";

type User = {
   name: string;
   photo: string;
};

declare module "@mui/material/styles" {
   interface TypeBackground {
      secondary: string;
   }
}

function App() {
   const [mode, setMode] = useState<"light" | "dark">(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
         return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
         ? "dark"
         : "light";
   });

   useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleThemeChange = (e: MediaQueryListEvent) => {
         const newMode = e.matches ? "dark" : "light";
         setMode(newMode);
         localStorage.setItem("theme", newMode); // Save updated theme to localStorage
      };

      mediaQuery.addEventListener("change", handleThemeChange);
      return () => mediaQuery.removeEventListener("change", handleThemeChange);
   }, []);

   useEffect(() => {
      localStorage.setItem("theme", mode);
   }, [mode]);
   // Default to device theme

   const [user, setUser] = useState<User | null>(null);
   const [signedIn, setSignedIn] = useState(false);
   const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if (currentUser) {
            const { displayName, photoURL } = currentUser;
            setUser({
               name: displayName || "User",
               photo: photoURL || "",
            });
            setSignedIn(true);
         } else {
            setUser(null);
            setSignedIn(false);
         }
         setLoading(false);
      });
      return () => unsubscribe();
   }, []);

   const theme = useMemo(
      () =>
         createTheme({
            palette: {
               mode,
               primary: {
                  main: "#f5bf46",
               },
               secondary: {
                  main: "#ff6161",
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

   const handleToggleTheme = () => {
      setMode((prev) => (prev === "light" ? "dark" : "light"));
   };

   const handleSignOut = async () => await signOut(auth);

   return (
      <div className="app">
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
               {loading ? (
                  <Loading />
               ) : (
                  <AppRoutes
                     signedIn={signedIn}
                     toggleModal={toggleModal}
                     user={user}
                     handleSignOut={handleSignOut}
                     isModalOpen={isModalOpen}
                     theme={theme}
                     handleToggleTheme={handleToggleTheme}
                  />
               )}
            </BrowserRouter>
         </ThemeProvider>
      </div>
   );
}

export default App;
