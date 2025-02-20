import React, { useState } from "react";
import "../../styles/nav.css";
import Logo from "../../assets/images/logo.svg";
import DefaultProfile from "/src/assets/icons/profile.svg";
import { Button } from "@mui/material";
import { Links } from "react-router-dom";
import { MagnifyingGlass } from "phosphor-react";

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
}

const Nav: React.FC<NavProps> = ({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   toggleModal,
   home,
}) => {
   return (
      <div className={`${home ? "nav" : "nav-dash"}`}>
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
            <div className="nav-logo">
               <img src={Logo} alt="Logo" />
               <p>Fulcrums</p>
            </div>
         </a>

         {!home && <SearchBar />}

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
      </div>
   );
};

export default Nav;

function SearchBar() {
   return (
      <div className="search-bar-container">
         <input
            type="text"
            placeholder="筛选产品名称或ID"
            className="search-input"
         />
         <button className="search-btn">
            <MagnifyingGlass size={18} />
         </button>
      </div>
   );
}
