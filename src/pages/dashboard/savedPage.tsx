import React, { useEffect, useState } from "react";
import { Typography, Box, Alert, Button, Stack } from "@mui/material";
import ProductCard from "../../components/dashboard/product/minProductCard";
import "../../styles/RecentProductPage.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import ClockLight from "../../assets/icons/recent-light.svg";
import ClockDark from "../../assets/icons/recent-dark.svg";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import Loading from "../../components/core/loading";
import { ProductTable } from "../../components/dashboard/product/productTable";
import { SquaresFour, ListBullets } from "phosphor-react";
import Loader from "../../components/core/loader";
import Suggestions from "../../components/dashboard/core/suggestion";

const SavedPage = () => {
   const { isDark, isSmUp, isMdUp } = useThemeContext();
   const { getProducts, products, errorMessages, loading, productLoading } =
      useProductSupplierClientContext();

   useEffect(() => {
      getProducts();
   }, []);

   // Filter for saved products
   const savedProducts = Object.entries(products).filter(
      ([, product]) => product.saved === true
   );
   const [viewMode, setViewMode] = useState(isMdUp ? "table" : "grid");

   useEffect(() => {
      document.title = "Fulcrums | 保存";
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
               <Alert severity="error">{errorMessages}</Alert>
            </Box>
         )}

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
               保存
            </Typography>

            <Stack direction={isSmUp ? "row-reverse" : "column"} gap={2}>
               <Box
                  sx={{
                     display: "inline-flex",
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
               <Button variant="contained" color="primary" size="small">
                  导出保存产品
               </Button>
            </Stack>
         </Box>

         <div className="gradient-divider" />

         {productLoading ? (
            <Stack
               direction="row"
               gap={1.5}
               justifyContent="center"
               alignItems="center"
            >
               <Typography variant="body2" textAlign="center">
                  拼命加载中...
               </Typography>
               <Loader />
            </Stack>
         ) : viewMode === "grid" ? (
            <div className="cards-grid">
               {savedProducts.map(([id, product]) => (
                  <ProductCard key={id} item={product} isDarkMode={isDark} />
               ))}
            </div>
         ) : (
            <ProductTable
               productList={savedProducts.map(([id, product]) => product)}
            />
         )}

         <Suggestions
            suggestions={[
               { title: "最近的产品", link: "/dashboard/recent" },
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

export default SavedPage;
