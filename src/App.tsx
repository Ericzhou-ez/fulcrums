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
import { useAppTheme } from "./themes/theme";

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

   const theme = useAppTheme(mode);

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
