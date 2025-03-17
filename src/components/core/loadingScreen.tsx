import React, { useState, useEffect } from "react";
import "../../styles/loadingScreen.css";
import logo from "../../assets/images/logo.svg";

const LoadingScreen = () => {
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      window.addEventListener("load", () => {
         setLoaded(true);
      });

      return () => window.removeEventListener("load", () => setLoaded(true));
   }, []);

   return (
      <div className={`loading-screen ${loaded ? "loaded" : ""}`}>
         <div className="spinner">
            <img src={logo} alt="Loading..." />
         </div>
      </div>
   );
};

export default LoadingScreen;
