import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
   signedIn: boolean;
   children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ signedIn, children }) => {
   return signedIn ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
