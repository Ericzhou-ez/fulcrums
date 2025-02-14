import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../pages/SignInPage";
import Dashboard from "../pages/dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import Home from "../pages/home";
import Components from "../pages/components";
import RecentProductsPage from "../pages/recentPage";
import PrivateRoute from "./privateRoute";

export interface AppRoutesProps {
   signedIn: boolean;
   user: any;
   handleSignOut: () => Promise<void>;
   isModalOpen: boolean;
   theme: any;
   handleToggleTheme: () => void;
   toggleModal: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   theme,
   handleToggleTheme,
   toggleModal,
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
               <PrivateRoute signedIn={signedIn}>
                  <Dashboard
                     signedIn={signedIn}
                     toggleModal={toggleModal}
                     user={user}
                     handleSignOut={handleSignOut}
                     isModalOpen={isModalOpen}
                     theme={theme}
                     handleToggleTheme={handleToggleTheme}
                  />
               </PrivateRoute>
            }
         />

         {/* Component dev route */}
         <Route path="/components" element={<Components />} />

         {/* marketing page */}
         <Route
            path="/"
            element={
               <Home theme={theme} handleToggleTheme={handleToggleTheme} />
            }
         />

         {/* recently added products page */}
         <Route
            path="/recent"
            element={
               <PrivateRoute signedIn={signedIn}>
                  <RecentProductsPage
                     signedIn={signedIn}
                     toggleModal={toggleModal}
                     user={user}
                     handleSignOut={handleSignOut}
                     isModalOpen={isModalOpen}
                     theme={theme}
                     handleToggleTheme={handleToggleTheme}
                  />
               </PrivateRoute>
            }
         />

         {/* Catch-all redirect */}
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   );
};

export default AppRoutes;
