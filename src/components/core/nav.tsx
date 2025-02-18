import React, { useState } from "react";
import "../../styles/nav.css";
import Logo from "../../assets/images/logo.svg";
import DefaultProfile from "/src/assets/icons/profile.svg";
import { Button } from "@mui/material";
import { Links } from "react-router-dom";

interface NavProps {
   signedIn: boolean;
   user: {
      name: string;
      photo: string;
   };
   handleSignOut: () => void;
   isModalOpen: boolean;
   toggleModal: () => void;
}

const Nav: React.FC<NavProps> = ({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   toggleModal,
}) => {
   return (
      <div className="nav">
         <a
            href="/dashboard"
            style={{
               all: "unset",
               cursor: "pointer",
               display: "flex",
               placeContent: "center",
            }}
         >
            <div className="nav-logo-container">
               <div className="nav-logo">
                  <img src={Logo} alt="Logo" />
               </div>
               <p>Fulcrum</p>
            </div>
         </a>

         {signedIn ? (
            <div className="profile-container" style={{ position: "relative" }}>
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
