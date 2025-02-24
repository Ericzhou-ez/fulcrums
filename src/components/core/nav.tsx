import React, { useState } from "react";
import "../../styles/nav.css";
import Logo from "../../assets/images/logo.svg";
import DefaultProfile from "/src/assets/icons/profile.svg";
import {
   Button,
   IconButton,
   useTheme,
   Box,
   useMediaQuery,
   Tooltip,
} from "@mui/material";
import { Links } from "react-router-dom";
import { MagnifyingGlass, List } from "phosphor-react";

interface NavProps {
   signedIn: boolean;
   user: {
      name: string;
      photo: string;
   };
   handleSignOut: () => void;
   isModalOpen: boolean;
   toggleModal: () => void;
   home: boolean;
   navOpen: boolean;
   setNavOpen: any;
   overlay: any;
   setOverlay: any;
}

const Nav: React.FC<NavProps> = ({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   toggleModal,
   home,
   navOpen,
   setNavOpen,
   overlay,
   setOverlay,
}) => {
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";
   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

   if (!isMdUp) {
      setOverlay(navOpen);
   }

   // if (typeof setNavOpen === "function") {
   //    setNavOpen((prevNavOpen: boolean) => {
   //       const newNavOpen = !prevNavOpen;

   //       if (!isMdUp) {
   //          setOverlay(newNavOpen);
   //       }

   //       return newNavOpen;
   //    });
   // }


   return (
      <Box
         className={
            isMdUp
               ? `${home ? "nav" : "nav-dash"} ${navOpen ? "nav-open" : ""}`
               : `${home ? "nav" : "nav-dash"}`
         }
      >
         <div
            className="menu"
            style={{ display: home ? "none" : "flex", placeContent: "center" }}
         >
            <IconButton
               onClick={() => setNavOpen(!navOpen)}
               style={
                  navOpen
                     ? { display: "none", padding: "2px" }
                     : { padding: "2px" }
               }
            >
               <List size={25} color={isDark ? "#fff" : "#000"} />
            </IconButton>
         </div>

         <a
            href={signedIn ? "/dashboard" : "/"}
            style={{
               all: "unset",
               cursor: "pointer",
               display: "flex",
               placeContent: "center",
            }}
            className={
               home ? "nav-logo-container" : "nav-logo-container-hidden"
            }
         >
            <div className="nav-logo" style={home ? {} : { display: "none" }}>
               <img src={Logo} alt="Logo" />
               <p>Fulcrums</p>
            </div>
         </a>

         {!home && <SearchBar isDark={isDark} />}

         {signedIn ? (
            <div className="profile-container" style={{ position: "relative" }}>
               {home ? (
                  <a href="/dashboard">
                     <img
                        src={user.photo ? user.photo : DefaultProfile}
                        alt={user.name || "p"}
                        className="user-photo"
                        style={{
                           objectFit: "cover",
                           cursor: "pointer",
                        }}
                        onClick={toggleModal}
                     />
                  </a>
               ) : (
                  <Tooltip title="账号">
                     <img
                        src={user.photo ? user.photo : DefaultProfile}
                        alt={user.name || "p"}
                        className="user-photo"
                        style={{
                           borderRadius: "50%",
                           objectFit: "cover",
                           cursor: "pointer",
                        }}
                        onClick={toggleModal}
                     />
                  </Tooltip>
               )}

               {isModalOpen && (
                  <div
                     className="profile-modal"
                     style={{
                        position: "absolute",
                        top: "40px",
                        right: "0",
                        background: "var(--background-secondary-color)",
                        borderRadius: "5px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                        zIndex: 100,
                        padding: "10px",
                     }}
                  >
                     <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                           toggleModal();
                           handleSignOut();

                           return;
                        }}
                     >
                        退出
                     </Button>
                  </div>
               )}
            </div>
         ) : (
            <div className="nav-links">
               <a href="/dashboard">
                  <button className="cta-btn-join">登录</button>
               </a>
            </div>
         )}
      </Box>
   );
};

export default Nav;

interface SearchBarProps {
   isDark: boolean;
}

function SearchBar({ isDark }: SearchBarProps) {
   return (
      <div className="search-bar-container">
         <input
            type="text"
            placeholder="筛选产品名称或ID"
            className="search-input"
         />
         <Tooltip title="搜索">
            <button className="search-btn">
               <MagnifyingGlass size={18} color={isDark ? "#fff" : "#000"} />
            </button>
         </Tooltip>
      </div>
   );
}
