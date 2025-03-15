import React from "react";
import { Typography, Box } from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/quotation.css";
import { useEffect } from "react";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";

const InternalQuoationPage = () => {
   useEffect(() => {
      document.title = "Fulcrums | 内部报价";
   }, []);
   const {
      navOpen,
      setNavOpen,
      overlay,
      closeOverlay,
      mainContentStyles,
   } = useUIStateContext();

   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav home={false} searchBar={true} />

         <div className="title-recent">
            <Typography
               variant="h6"
               component="h1"
               className="title-text-recent"
               sx={{
                  fontSize: {
                     xs: "2rem",
                     sm: "2.2rem",
                     md: "2.4rem",
                     lg: "2.8rem",
                  },
               }}
            >
               内部报价
            </Typography>
         </div>

         <div className="gradient-divider"></div>

         {overlay && (
            <div
               style={{
                  position: "fixed",
                  width: "100vw",
                  height: "100vh",
                  zIndex: 500,
                  top: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  backdropFilter: "blur(2px)",
               }}
               onClick={closeOverlay}
            ></div>
         )}

         <Footer />
      </Box>
   );
};

export default InternalQuoationPage;
