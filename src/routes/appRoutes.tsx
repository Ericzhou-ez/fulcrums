import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { AuthProvider } from "../contexts/authContexts";
import { UserServiceProvider } from "../contexts/userServices";
import { UserType } from "../types/types";
import SignInPage from "../pages/SignInPage";
import Dashboard from "../pages/dashboard/dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import Home from "../pages/marketing/home";
import Components from "../pages/components";
import RecentProductsPage from "../pages/dashboard/recentPage";
import PrivateRoute from "./privateRoute";
import SavedPage from "../pages/dashboard/savedPage";
import TermsOfServicePage from "../pages/marketing/termsOfServicePage";
import PrivacyPolicyPage from "../pages/marketing/privacyPage";
import InternalQuotationPage from "../pages/dashboard/internalQuotation";
import ExternalQuotationPage from "../pages/dashboard/externalQuotation";
import SearchPage from "../pages/dashboard/searchPage";
import SettingPage from "../pages/dashboard/settingsPage";
import ContactPage from "../pages/marketing/contactPage";
import Loading from "../components/core/loading";
import { useThemeContext } from "../contexts/themeContextProvider";

export interface AppRoutesProps {
   isModalOpen: boolean;
   toggleModal: () => void;
   loading: boolean;
   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
   isModalOpen,
   toggleModal,
   loading,
   setLoading,
}) => {
   const { isMdUp } = useThemeContext();
   const [navOpen, setNavOpen] = useState(() => isMdUp);
   const [overlay, setOverlay] = useState(() => !isMdUp);
   const closeOverlay = () => {
      setOverlay(false);
      setNavOpen(false);
   };
   const [user, setUser] = useState<UserType | null>(null);
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const signedIn = !!user;


   return (
      <UserServiceProvider
         setUser={setUser}
         loading={loading}
         user={user}
         setLoading={setLoading}
         errorMessage={errorMessage}
         setErrorMessage={setErrorMessage}
         successMessage={successMessage}
         setSuccessMessage={setSuccessMessage}
      >
         <AuthProvider
            setLoading={setLoading}
            setUser={setUser}
            loading={loading}
            user={user}
         >
            <Routes>
               <Route
                  path="/signin"
                  element={
                     loading ? (
                        <Loading />
                     ) : signedIn ? (
                        <Navigate to="/dashboard" />
                     ) : (
                        <SignInPage
                           isModalOpen={isModalOpen}
                           toggleModal={toggleModal}
                        />
                     )
                  }
               />

               <Route
                  path="/dashboard"
                  element={
                     <PrivateRoute>
                        <Dashboard
                           toggleModal={toggleModal}
                           isModalOpen={isModalOpen}
                           navOpen={navOpen}
                           setNavOpen={setNavOpen}
                           overlay={overlay}
                           setOverlay={setOverlay}
                           closeOverlay={closeOverlay}
                        />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/dashboard/settings"
                  element={
                     <PrivateRoute>
                        <SettingPage
                           toggleModal={toggleModal}
                           isModalOpen={isModalOpen}
                           navOpen={navOpen}
                           setNavOpen={setNavOpen}
                           overlay={overlay}
                           setOverlay={setOverlay}
                           closeOverlay={closeOverlay}
                        />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/dashboard/quotation/internal"
                  element={
                     <PrivateRoute>
                        <InternalQuotationPage
                           toggleModal={toggleModal}
                           isModalOpen={isModalOpen}
                           navOpen={navOpen}
                           setNavOpen={setNavOpen}
                           overlay={overlay}
                           setOverlay={setOverlay}
                           closeOverlay={closeOverlay}
                        />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/dashboard/quotation/external"
                  element={
                     <PrivateRoute>
                        <ExternalQuotationPage
                           toggleModal={toggleModal}
                           isModalOpen={isModalOpen}
                           navOpen={navOpen}
                           setNavOpen={setNavOpen}
                           overlay={overlay}
                           setOverlay={setOverlay}
                           closeOverlay={closeOverlay}
                        />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/dashboard/search"
                  element={
                     <PrivateRoute>
                        <SearchPage
                           toggleModal={toggleModal}
                           isModalOpen={isModalOpen}
                           navOpen={navOpen}
                           setNavOpen={setNavOpen}
                           overlay={overlay}
                           setOverlay={setOverlay}
                           closeOverlay={closeOverlay}
                        />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/dashboard/recent"
                  element={
                     <PrivateRoute>
                        <RecentProductsPage
                           toggleModal={toggleModal}
                           isModalOpen={isModalOpen}
                           navOpen={navOpen}
                           setNavOpen={setNavOpen}
                           overlay={overlay}
                           setOverlay={setOverlay}
                           closeOverlay={closeOverlay}
                        />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/dashboard/saved"
                  element={
                     <PrivateRoute>
                        <SavedPage
                           toggleModal={toggleModal}
                           isModalOpen={isModalOpen}
                           navOpen={navOpen}
                           setNavOpen={setNavOpen}
                           overlay={overlay}
                           setOverlay={setOverlay}
                           closeOverlay={closeOverlay}
                        />
                     </PrivateRoute>
                  }
               />
               <Route path="/components" element={<Components />} />
               <Route path="/" element={<Home />} />
               <Route
                  path="/terms"
                  element={
                     <TermsOfServicePage
                        toggleModal={toggleModal}
                        isModalOpen={isModalOpen}
                     />
                  }
               />
               <Route
                  path="/contact"
                  element={
                     <ContactPage
                        toggleModal={toggleModal}
                        isModalOpen={isModalOpen}
                     />
                  }
               />
               <Route
                  path="/privacy"
                  element={
                     <PrivacyPolicyPage
                        toggleModal={toggleModal}
                        isModalOpen={isModalOpen}
                     />
                  }
               />
               <Route path="*" element={<NotFoundPage />} />
            </Routes>
         </AuthProvider>
      </UserServiceProvider>
   );
};

export default AppRoutes;
