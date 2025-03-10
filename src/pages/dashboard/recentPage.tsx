import React from "react";
import { Typography, Box } from "@mui/material";
import ProductCard from "../../components/dashboard/minProductCard";
import "../../styles/RecentProductPage.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
// Light/Dark icons for the top bar (optional)
import ClockLight from "../../assets/icons/description-light.svg";
import ClockDark from "../../assets/icons/description-dark.svg";
import { useThemeContext } from "../../contexts/themeContextProvider";

export interface RecentProductsPageProps {
   isModalOpen: boolean;
   
   toggleModal: () => void;
   navOpen: boolean;
   setNavOpen: any;
   overlay: boolean;
   setOverlay: any;
   closeOverlay: () => void;
}

const mainContentStyles = (navOpen: boolean) => ({
   marginLeft: {
      xs: 0,
      md: navOpen ? "240px" : "0px",
   },
   transition: "margin-left 0.3s ease",
   padding: 2,
});

const RecentProductsPage: React.FC<RecentProductsPageProps> = ({
   isModalOpen,
   
   toggleModal,
   navOpen,
   setNavOpen,
   overlay,
   setOverlay,
   closeOverlay
}) => {
   const {isDark} = useThemeContext();

   const productList = [
      {
         id: 1,
         title: "财神蛇公仔毛绒玩公仔",
         productId: "13355894839",
         postedTime: "5分钟前",
      },
      {
         id: 2,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894840",
         postedTime: "5分钟前",
      },
      {
         id: 3,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894841",
         postedTime: "5分钟前",
      },
      {
         id: 4,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894841",
         postedTime: "5分钟前",
      },
      {
         id: 5,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894841",
         postedTime: "5分钟前",
      },
      {
         id: 6,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894841",
         postedTime: "5分钟前",
      },
      {
         id: 7,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894841",
         postedTime: "5分钟前",
      },
      {
         id: 8,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894841",
         postedTime: "5分钟前",
      },
      {
         id: 9,
         title: "财神蛇公仔毛绒玩具",
         productId: "13355894841",
         postedTime: "5分钟前",
      },
   ];

   const clockIcon = isDark ? ClockDark : ClockLight;

   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav
            home={false}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            overlay={overlay}
            setOverlay={setOverlay}
            searchBar={false}
         />

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

export default RecentProductsPage;
