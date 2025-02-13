import React from "react";
import { createTheme, ThemeProvider, CssBaseline, Container, Typography } from "@mui/material";
import Nav from "../components/nav";
import Footer from "../components/footer";
import "../styles/dashboard.css";
import { Auth } from "firebase/auth";  

interface DashboardProps {
   user: { name: string; photo: string };
   signedIn: boolean;
   isModalOpen: boolean;
   theme: string;
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
            signedIn={signedIn}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
         />

         <Container>
            <Typography variant="h1">Hello {user?.name || "User"}!</Typography>
         </Container>

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </div>
   );
};

export default Dashboard;
