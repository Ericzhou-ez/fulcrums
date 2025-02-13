import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../pages/SignInPage";
import Dashboard from "../pages/dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import Home from "../pages/home";

export interface AppRoutesProps {
   signedIn: boolean;
   user: any;
   handleSignOut: () => Promise<void>;
   isModalOpen: boolean;
   setIsModalOpen: (value: boolean) => void;
   toggleModal: () => void;
   theme: any;
   handleToggleTheme: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   setIsModalOpen,
   toggleModal,
   theme,
   handleToggleTheme,
}) => {
   return (
      <Routes>
         {/* Route for sign-in */}
         <Route
            path="/signin"
            element={
               signedIn ? (
                  <Navigate to="/dashboard" />
               ) : (
                  <SignInPage
                     signedIn={signedIn}
                     user={user}
                     theme={theme}
                     handleToggleTheme={handleToggleTheme}
                  />
               )
            }
         />

         {/* Main Dashboard route */}
         <Route
            path="/dashboard"
            element={
               signedIn ? (
                  <Dashboard
                     signedIn={signedIn}
                     user={user}
                     handleSignOut={handleSignOut}
                     isModalOpen={isModalOpen}
                     setIsModalOpen={setIsModalOpen}
                     toggleModal={toggleModal}
                     theme={theme}
                     handleToggleTheme={handleToggleTheme}
                  />
               ) : (
                  <Navigate to="/signin" />
               )
            }
         />

         {/* marketing page */}
         <Route
            path="/"
            element={
               <Home theme={theme} handleToggleTheme={handleToggleTheme} />
            }
         />

         {/* Catch-all redirect */}
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   );
};

export default AppRoutes;
