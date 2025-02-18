import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
   let location;
   try {
      location = useLocation();
   } catch (e) {
      return null; 
   }

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [location.pathname]);

   return null;
}
