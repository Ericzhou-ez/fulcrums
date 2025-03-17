import React from "react";
import { Typography, Box } from "@mui/material";
import ProductCard from "../../components/dashboard/minProductCard";
import "../../styles/RecentProductPage.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import ClockLight from "../../assets/icons/recent-light.svg";
import ClockDark from "../../assets/icons/recent-dark.svg";
import SideNav from "../../components/dashboard/dashboardNav";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { useEffect } from "react";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";

const SavedPage = () => {
   const { isDark } = useThemeContext();

   const productList = [
      {
         name: "财神蛇公仔毛绒玩公仔",
         id: "13355894839",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894840",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894841",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894841",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894841",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894841",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894841",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894841",
         updatedAt: "5分钟前",
      },
      {
         name: "财神蛇公仔毛绒玩具",
         id: "13355894841",
         updatedAt: "5分钟前",
      },
   ];

   const clockIcon = isDark ? ClockDark : ClockLight;

   useEffect(() => {
      document.title = "Fulcrums | 保存";
   }, []);

   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();
      
   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav home={false} searchBar={true} />

         <div className="title-recent">
            <img
               src={clockIcon}
               height="30px"
               width="30px"
               alt="Clock"
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
               保存
            </Typography>
         </div>

         <div className="gradient-divider" />

         <div className="cards-grid">
            {productList.map((item) => (
               <ProductCard key={item.id} item={item} isDarkMode={isDark} />
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

export default SavedPage;
