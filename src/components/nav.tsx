import { useState } from "react";
import "../styles/nav.css";
import Logo from "../assets/images/logo.svg";
import DefaultProfile from "../assets/icons/profile.svg";
import { Button } from "@mui/material";

export default function Nav({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   setIsModalOpen,
   toggleModal,
}) {
   return (
      <div className="nav">
         <div className="nav-logo">
            <img src={Logo} alt="Logo" />
         </div>

         <div className="profile-container" style={{ position: "relative" }}>
            <img
               src={user?.photo || DefaultProfile}
               alt={user?.name || "Sign In"}
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
                     top: "50px",
                     right: "0",
                     background: "white",
                     borderRadius: "5px",
                     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                     zIndex: 100,
                     padding: "10px",
                  }}
               >
                  <Button variant="contained" color="secondary" onClick={toggleModal}>
                     退出
                  </Button>
               </div>
            )}
         </div>
      </div>
   );
}
