import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router";
import Loading from "./components/core/loading";
import ScrollToTop from "./components/core/scrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { ThemeContextProvider } from "./contexts/themeContextProvider";
import { useAppTheme } from "./themes/theme";
import { AuthProvider } from "./contexts/authContexts";
import { UserType } from "./types/types";
import { UIStateContextProvider } from "./contexts/UIStateContextProvider";

declare module "@mui/material/styles" {
   interface TypeBackground {
      secondary: string;
   }
}

function App() {
   const [serviceLoading, setServiceLoading] = useState(true);
   const [loading, setLoading] = useState(true);
   const [mode, setMode] = useState<"light" | "dark">(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
         return savedTheme;
      }
      return "light";
   });
   const [user, setUser] = useState<UserType | null>(null);
   const theme = useAppTheme(mode);

   return (
      <AuthProvider
         setLoading={setLoading}
         loading={loading}
         setUser={setUser}
         user={user}
      >
         <ThemeProvider theme={theme}>
            <ThemeContextProvider mode={mode} setMode={setMode}>
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
            </ThemeContextProvider>
         </ThemeProvider>
      </AuthProvider>
   );
}

export default App;
