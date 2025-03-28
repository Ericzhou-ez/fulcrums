import React, { useState, useEffect } from "react";
import {
   createTheme,
   ThemeProvider,
   CssBaseline,
   Container,
   Typography,
   Stack,
   Box,
   useMediaQuery,
   useTheme,
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import "../../styles/dashboard.css";
import { Auth } from "firebase/auth";
import DashboardOverview from "../../components/dashboard/overview/dashboardOverview";
import SideNav from "../../components/dashboard/dashboardNav";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";


const Dashboard = () => {
   const { isMdUp } = useThemeContext();
   const {
      navOpen,
      setNavOpen,
      overlay,
      closeOverlay,
      mainContentStyles,
   } = useUIStateContext();

   React.useEffect(() => {
      if (isMdUp) {
         setNavOpen(true);
      } else {
         setNavOpen(false);
         closeOverlay();
      }
   }, [isMdUp]);

   useEffect(() => {
      document.title = "Fulcrums | 仪表";
   }, []);

   return (
      <Box className="dashboard" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav
            home={false}
            searchBar={true}
         />

         <DashboardOverview />

         {overlay && (
            <div
               style={{
                  transition: "all 0.2s ease-in-out",
                  position: "fixed",
                  width: "100vw",
                  height: "100vh",
                  zIndex: 500,
                  top: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  backdropFilter: "blur(2px)",
               }}
               onClick={closeOverlay}
            ></div>
         )}
      </Box>
   );
};

export default Dashboard;
