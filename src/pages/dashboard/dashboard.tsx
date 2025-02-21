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
         />

         <DashboardOverview
            theme={theme}
            handleToggleTheme={handleToggleTheme}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
         />
      </Box>
   );
};

export default Dashboard;
