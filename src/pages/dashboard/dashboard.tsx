import React from "react";
import {
   createTheme,
   ThemeProvider,
   CssBaseline,
   Container,
   Typography,
   Stack,
   Box,
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import "../../styles/dashboard.css";
import { Auth } from "firebase/auth";
import DashboardOverview from "../../components/dashboard/dashboardOverview";

interface DashboardProps {
   user: { name: string; photo: string };
   signedIn: boolean;
   isModalOpen: boolean;
   theme: any;
   handleToggleTheme: () => void;
   handleSignOut: () => Promise<void>;
   toggleModal: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
   user,
   signedIn,
   isModalOpen,
   theme,
   handleToggleTheme,
   handleSignOut,
   toggleModal,
}) => {
   return (
      <div className="dashboard">
         <Nav
            user={user}
            home={false}
            signedIn={signedIn}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
         />

         <DashboardOverview theme={theme} />

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </div>
   );
};

export default Dashboard;
