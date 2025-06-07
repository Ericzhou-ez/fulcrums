import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import AddProductPage from "../pages/dashboard/AddProductPage";
import { UIStateContextProvider } from "../contexts/UIStateContextProvider";
import {
   ProductSupplierClientContextProvider,
   useProductSupplierClientContext,
} from "../contexts/productSupplierClientContextProvider";
import GlobalKeyListener, {
   GlobalCommandListener,
   GlobalHomeListener,
   GlobalProfileListener,
   GlobalThemeListener,
} from "../components/core/eventListeners";
import DisplayProductPage from "../pages/dashboard/displayProductPage";
import { Snackbar, IconButton } from "@mui/material";
import { X as CloseIcon } from "phosphor-react";
import ClientsPage from "../pages/dashboard/clientsPage";

export interface AppRoutesProps {
   loading: boolean;
   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
   serviceLoading: boolean;
   setServiceLoading: React.Dispatch<React.SetStateAction<boolean>>;
   user: UserType | null;
   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
   serviceLoading,
   setServiceLoading,
   loading,
   user,
   setUser,
}) => {
   const { isMdUp } = useThemeContext();
   const [navOpen, setNavOpen] = useState(() => isMdUp);
   const [overlay, setOverlay] = useState(() => !isMdUp);
   const closeOverlay = () => {
      setOverlay(false);
      setNavOpen(false);
   };
   const [errorMessage, setErrorMessage] = useState(""); // auth related
   const [successMessage, setSuccessMessage] = useState("");
   const [errorMessages, setErrorMessages] = useState<string>(""); // service related
   const signedIn = !!user;

   const action = (
      <IconButton
         size="small"
         aria-label="close"
         onClick={() => setErrorMessages("")}
      >
         <CloseIcon />
      </IconButton>
   );

   return loading ? (
      <Loading />
   ) : (
      <UserServiceProvider
         setUser={setUser}
         user={user}
         serviceLoading={serviceLoading}
         setServiceLoading={setServiceLoading}
         errorMessage={errorMessage}
         setErrorMessage={setErrorMessage}
         successMessage={successMessage}
         setSuccessMessage={setSuccessMessage}
      >
         <UIStateContextProvider>
            <ProductSupplierClientContextProvider
               serviceLoading={serviceLoading}
               setServiceLoading={setServiceLoading}
               errorMessages={errorMessages}
               setErrorMessages={setErrorMessages}
            >
               <GlobalKeyListener />
               <GlobalCommandListener />
               <GlobalProfileListener />
               <GlobalHomeListener />
               <GlobalThemeListener />

               {errorMessages && (
                  <Snackbar
                     open={!!errorMessages}
                     autoHideDuration={5000}
                     message={errorMessages}
                     anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                     action={action}
                     onClose={() => setErrorMessages("")}
                  />
               )}

               <Routes>
                  <Route
                     path="/signin"
                     element={
                        loading ? (
                           <Loading />
                        ) : signedIn ? (
                           <Navigate to="/dashboard" />
                        ) : (
                           <SignInPage />
                        )
                     }
                  />
                  <Route path="/components" element={<Components />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />

                  <Route
                     path="/product/:productId"
                     element={
                        <PrivateRoute>
                           <DisplayProductPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard"
                     element={
                        <PrivateRoute>
                           <Dashboard />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/settings"
                     element={
                        <PrivateRoute>
                           <SettingPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/quotation/internal"
                     element={
                        <PrivateRoute>
                           <InternalQuotationPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/quotation/external"
                     element={
                        <PrivateRoute>
                           <ExternalQuotationPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/add-product"
                     element={
                        <PrivateRoute>
                           <AddProductPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/search"
                     element={
                        <PrivateRoute>
                           <SearchPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/recent"
                     element={
                        <PrivateRoute>
                           <RecentProductsPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/saved"
                     element={
                        <PrivateRoute>
                           <SavedPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path="/dashboard/clients"
                     element={
                        <PrivateRoute>
                           <ClientsPage />
                        </PrivateRoute>
                     }
                  />

                  <Route path="*" element={<NotFoundPage />} />
               </Routes>
            </ProductSupplierClientContextProvider>
         </UIStateContextProvider>
      </UserServiceProvider>
   );
};

export default AppRoutes;
