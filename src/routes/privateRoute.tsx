import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";
import Loading from "../components/core/loading";

interface PrivateRouteProps {
   children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
   const { signedIn, loading } = useAuth();

   if (loading) {
      return <Loading />
   }

   return signedIn ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
