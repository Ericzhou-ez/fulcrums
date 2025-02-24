import React, { useState } from "react";
import {
   createTheme,
   ThemeProvider,
   CssBaseline,
   Container,
   Typography,
   Stack,
   Box,
   useMediaQuery
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import "../../styles/dashboard.css";
import { Auth } from "firebase/auth";
import DashboardOverview from "../../components/dashboard/dashboardOverview";
import SideNav from "../../components/dashboard/dashboardNav";

interface DashboardProps {
   user: { name: string; photo: string };
   signedIn: boolean;
   isModalOpen: boolean;
   theme: any;
   handleToggleTheme: () => void;
   handleSignOut: () => Promise<void>;
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
   user,
   signedIn,
   isModalOpen,
   theme,
   handleToggleTheme,
   handleSignOut,
   toggleModal,
   navOpen,
   setNavOpen,
   overlay,
   setOverlay,
   closeOverlay,
}) => {
   const isMdUp = useMediaQuery(theme.breakpoints.down("md"));

   React.useEffect(() => {
      if (isMdUp) {
         setNavOpen(false);
      }
   }, [isMdUp]);

   return (
      <Box className="dashboard" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav
            user={user}
            home={false}
            navOpen={navOpen}
            signedIn={signedIn}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            setNavOpen={setNavOpen}
            overlay={overlay}
            setOverlay={setOverlay}
         />

         <DashboardOverview
            theme={theme}
            handleToggleTheme={handleToggleTheme}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
         />

         {overlay && (
            <div
               style={{
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
