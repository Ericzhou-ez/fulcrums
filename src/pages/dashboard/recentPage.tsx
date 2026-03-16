import React, { useEffect, useMemo, useState } from "react";
import { Typography, Box, Alert, Button, Stack } from "@mui/material";
import ProductCard from "../../components/dashboard/product/minProductCard";
import "../../styles/RecentProductPage.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import ClockLight from "../../assets/icons/description-light.svg";
import ClockDark from "../../assets/icons/description-dark.svg";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import Loading from "../../components/core/loading";
import { ProductTable } from "../../components/dashboard/product/productTable";
import { SquaresFour, ListBullets } from "phosphor-react";
import Loader from "../../components/core/loader";
import Suggestions from "../../components/dashboard/core/suggestion";

const GRID_PAGE_SIZE = 20;

const RecentProductsPage = () => {
   const { isDark, isMdUp, isSmUp } = useThemeContext();
   const { getProductsPage } = useProductSupplierClientContext();

   const recentPageItems = React.useMemo(
      () => getProductsPage(0, GRID_PAGE_SIZE, { sortOrder: "desc" }).items,
      [getProductsPage]
   );

   useEffect(() => {
      document.title = "Fulcrums | 最近";
   }, []);

   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();

   const [viewMode, setViewMode] = useState("");
   useEffect(() => {
      setViewMode(isMdUp ? "table" : "grid");
   }, []);

   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
         <Nav home={false} searchBar={true} />

         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               mt: 2,
            }}
            pb={isSmUp ? 0 : 2}
         >
            <Typography
               variant="h6"
               component="h1"
               className="title-text-recent"
               sx={{
                  fontSize: {
                     xs: "2rem",
                     sm: "2.2rem",
                     md: "2.4rem",
                     lg: "3rem",
                  },
                  ml: 1,
               }}
            >
               最近
            </Typography>

            <Stack direction={isSmUp ? "row-reverse" : "column"} gap={2}>
               <Box
                  sx={{
                     display: "inline-flex",
                     borderColor: "divider",
                     overflow: "hidden",
                  }}
               >
                  <Button
                     variant={viewMode === "grid" ? "contained" : "outlined"}
                     onClick={() => setViewMode("grid")}
                     color="info"
                     sx={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        px: 3.5,
                        minWidth: "auto",
                     }}
                     size="small"
                  >
                     <SquaresFour size={20} />
                  </Button>
                  <Button
                     variant={viewMode === "table" ? "contained" : "outlined"}
                     onClick={() => setViewMode("table")}
                     color="info"
                     sx={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        px: 3.5,
                        minWidth: "auto",
                     }}
                     size="small"
                  >
                     <ListBullets size={20} />
                  </Button>
               </Box>
            </Stack>
         </Box>

         <div className="gradient-divider"></div>

         {viewMode === "grid" ? (
            <div className="cards-grid">
               {recentPageItems.map((product) => (
                  <ProductCard
                     key={product.productId}
                     item={product}
                     isDarkMode={isDark}
                  />
               ))}
            </div>
         ) : (
            <ProductTable />
         )}

         <Suggestions
            suggestions={[
               { title: "保存的产品", link: "/dashboard/saved" },
               { title: "添加新产品", link: "/dashboard/add-product" },
               { title: "客户报价", link: "/dashboard/quotation/external" },
            ]}
         />

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
