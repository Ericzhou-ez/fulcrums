import React from "react";
import { useEffect } from "react";
import { Typography, Box, Alert } from "@mui/material";
import ProductCard from "../../components/dashboard/minProductCard";
import "../../styles/RecentProductPage.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
// Light/Dark icons for the top bar (optional)
import ClockLight from "../../assets/icons/description-light.svg";
import ClockDark from "../../assets/icons/description-dark.svg";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import Loading from "../../components/core/loading";

export interface RecentProductsPageProps {
   isModalOpen: boolean;

   toggleModal: () => void;
   navOpen: boolean;
   setNavOpen: any;
   overlay: boolean;
   setOverlay: any;
   closeOverlay: () => void;
}

const RecentProductsPage = () => {
   const { isDark } = useThemeContext();
   const {getProducts, products, errorMessages, loading} = useProductSupplierClientContext();

   useEffect(() => {
      getProducts();
   }, []);

   const productList = products;
   console.log(productList);

   const clockIcon = isDark ? ClockDark : ClockLight;

   useEffect(() => {
      document.title = "Fulcrums | 最近";
   }, []);

    const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
       useUIStateContext();

   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         {loading && <Loading />}

         {errorMessages && (
            <Box
               sx={{
                  position: "fixed",
                  top: 0,
                  zIndex: "5000",
                  width: navOpen ? "calc(100% - 240px)" : "100%",
               }}
            >
               {errorMessages ? (
                  <Alert severity="error">{errorMessages}</Alert>
               ) : null}
            </Box>
         )}

         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav home={false} searchBar={true} />

         <div className="title-recent">
            <img
               src={clockIcon}
               height="30px"
               width="30px"
               alt="o"
               className="top-bar-icon"
            />
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
               最近
            </Typography>
         </div>

         <div className="gradient-divider"></div>

         <div className="cards-grid">
            {Object.entries(productList).map(([id, product]) => (
               <ProductCard key={id} item={product} isDarkMode={isDark} />
            ))}
         </div>

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

export default RecentProductsPage;
