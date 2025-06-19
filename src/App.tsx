import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router";
import Loading from "./components/core/loading";
import ScrollToTop from "./components/core/scrollToTop";
import { Analytics } from "@vercel/analytics/react";
import {
   ThemeContextProvider,
   useThemeContext,
   ThemeMode,
} from "./contexts/themeContextProvider";
import { useAppTheme } from "./themes/theme";
import { AuthProvider } from "./contexts/authContexts";
import { UserType } from "./types/types";
import { UIStateContextProvider } from "./contexts/UIStateContextProvider";

declare module "@mui/material/styles" {
   interface TypeBackground {
      secondary: string;
   }
}

function ThemedApp({
   serviceLoading,
   setServiceLoading,
   loading,
   setLoading,
   user,
   setUser,
   mode,
   setMode,
}: any) {
   const { effectiveMode } = useThemeContext();
   const theme = useAppTheme(effectiveMode);

   return (
      <ThemeProvider theme={theme}>
         <Analytics />
         <CssBaseline />
         <UIStateContextProvider>
            <BrowserRouter>
               <ScrollToTop />
               {serviceLoading && <Loading />}
               <AppRoutes
                  loading={loading}
                  setLoading={setLoading}
                  serviceLoading={serviceLoading}
                  setServiceLoading={setServiceLoading}
                  user={user}
                  setUser={setUser}
               />
            </BrowserRouter>
         </UIStateContextProvider>
      </ThemeProvider>
   );
}

function App() {
   const [mode, setMode] = useState<ThemeMode>(() => {
      const savedTheme = localStorage.getItem("theme");
      if (
         savedTheme === "light" ||
         savedTheme === "dark" ||
         savedTheme === "system"
      ) {
         return savedTheme;
      }
      return "system";
   });
   const [serviceLoading, setServiceLoading] = useState(true);
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<UserType | null>(null);

   return (
      <AuthProvider
         setLoading={setLoading}
         loading={loading}
         setUser={setUser}
         user={user}
      >
         <ThemeContextProvider mode={mode} setMode={setMode}>
            <ThemedApp
               serviceLoading={serviceLoading}
               setServiceLoading={setServiceLoading}
               loading={loading}
               setLoading={setLoading}
               user={user}
               setUser={setUser}
               mode={mode}
               setMode={setMode}
            />
         </ThemeContextProvider>
      </AuthProvider>
   );
}

export default App;
