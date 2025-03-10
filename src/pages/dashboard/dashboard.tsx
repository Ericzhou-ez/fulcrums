import React, { useState } from "react";
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
import DashboardOverview from "../../components/dashboard/dashboardOverview";
import SideNav from "../../components/dashboard/dashboardNav";
import { useThemeContext } from "../../contexts/themeContextProvider";

interface DashboardProps {
   isModalOpen: boolean;

   toggleModal: () => void;
   navOpen: boolean;
   setNavOpen: any;
   overlay: any;
   setOverlay: any;
   closeOverlay: () => void;
}

const mainContentStyles = (navOpen: boolean) => ({
   marginLeft: {
      xs: 0,
      md: navOpen ? "240px" : "0px",
   },
   transition: "margin-left 0.3s ease",
   padding: 2,
});

const Dashboard: React.FC<DashboardProps> = ({
   isModalOpen,
   toggleModal,
   navOpen,
   setNavOpen,
   overlay,
   setOverlay,
   closeOverlay,
}) => {
   const { isMdUp } = useThemeContext();

   React.useEffect(() => {
      if (isMdUp) {
         setNavOpen(true);
      } else {
         setNavOpen(false);
         closeOverlay();
      }
   }, [isMdUp]);

   return (
      <Box className="dashboard" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav
            home={false}
            navOpen={navOpen}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            setNavOpen={setNavOpen}
            overlay={overlay}
            setOverlay={setOverlay}
            searchBar={false}
         />

         <DashboardOverview navOpen={navOpen} setNavOpen={setNavOpen} />

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
