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

function App() {
   const [mode, setMode] = useState(() =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
         ? "dark"
         : "light"
   ); // Default to device theme

   const [user, setUser] = useState(null);
   const [signedIn, setSignedIn] = useState(false);
   const [loading, setLoading] = useState(false);
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
               photo: photoURL || "https://via.placeholder.com/150",
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
                   main: "#f5bf46", // Orange
                },
                secondary: {
                   main: "#ff6161", // Accent red
                },
                background: {
                   default: mode === "light" ? "#ffffff" : "#121212",
                   secondary: mode === "light" ? "#f7f7f7" : "#1e1e1e", // New background secondary color
                },
                text: {
                   primary: mode === "light" ? "#000000" : "#ffffff",
                   secondary: mode === "light" ? "#555555" : "#cccccc",
                },
                tertiary: {
                   main: mode === "light" ? "#888888" : "#444444", // Additional gray tone
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
       const { primary, secondary, background, text, tertiary } = theme.palette;
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
          "--tertiary-color",
          tertiary.main
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
               <AppRoutes
                  signedIn={signedIn}
                  user={user}
                  handleSignOut={handleSignOut}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  toggleModal={toggleModal}
                  theme={theme}
                  handleToggleTheme={handleToggleTheme}
               />
            </BrowserRouter>
         </ThemeProvider>
      </div>
   );
}

export default App;