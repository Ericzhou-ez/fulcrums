import React, { useMemo, useState, useEffect } from "react";
import {
   createTheme,
   ThemeProvider,
   CssBaseline,
   Container,
   Typography,
} from "@mui/material";
import Nav from "../components/nav";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Footer from "../components/footer";

interface DashboardProps {
   user: any;
   signedIn: boolean;
   auth: any;
   isModalOpen: boolean;
   setIsModalOpen: (value: boolean) => void;
   toggleModal: () => void;
   theme: any;
   handleToggleTheme: () => void;
   handleSignOut: () => Promise<void>;
}

export default function Dashboard({
   user,
   signedIn,
   auth,
   isModalOpen,
   setIsModalOpen,
   toggleModal,
   theme,
   handleToggleTheme,
   handleSignOut,
}) {
   return (
      <React.Fragment>
         <Nav
            user={user}
            signedIn={signedIn}
            handleSignOut={async () => await signOut(auth)}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            toggleModal={toggleModal}
            handleSignOut={handleSignOut}
         />

         <Container>
            <Typography variant="h1">Hello Richard</Typography>
         </Container>

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </React.Fragment>
   );
}
