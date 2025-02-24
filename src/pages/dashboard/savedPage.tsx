import React from "react";
import { Typography, Box } from "@mui/material";
import ProductCard from "../../components/dashboard/minProductCard";
import "../../styles/RecentProductPage.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import ClockLight from "../../assets/icons/recent-light.svg";
import ClockDark from "../../assets/icons/recent-dark.svg";
import SideNav from "../../components/dashboard/dashboardNav";

export interface SavedPageProps {
   signedIn: boolean;
   user: any;
   handleSignOut: () => Promise<void>;
   isModalOpen: boolean;
   theme: any;
   handleToggleTheme: () => void;
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

const SavedPage: React.FC<SavedPageProps> = ({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   theme,
   handleToggleTheme,
   toggleModal,
   navOpen,
   setNavOpen,
   overlay,
   setOverlay,
   closeOverlay,
}) => {
   const isDarkMode = theme === "dark";

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

   const clockIcon = isDarkMode ? ClockDark : ClockLight;

   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav
            home={false}
            signedIn={signedIn}
            user={user}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            overlay={overlay}
            setOverlay={setOverlay}
         />

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
               <ProductCard key={item.id} item={item} isDarkMode={isDarkMode} />
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

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </Box>
   );
};

export default SavedPage;
