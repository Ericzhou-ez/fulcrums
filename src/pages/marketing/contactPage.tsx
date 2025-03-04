import React from "react";
import "../../styles/privacy.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import { Tooltip } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import FooterName from "../../assets/images/footerName.svg";
import ContactMain from "../../components/marketing/contactMain";

interface ContactUsPageProps {
   signedIn: boolean;
   toggleModal: () => void;
   user: any;
   handleSignOut: () => void;
   isModalOpen: boolean;
   theme: any;
   handleToggleTheme: () => void;
}

export default function ContactPage({
   signedIn,
   toggleModal,
   user,
   handleSignOut,
   isModalOpen,
   theme,
   handleToggleTheme,
}: ContactUsPageProps) {
   const [footerHeight, setFooterHeight] = useState(0);
   const imgRef = useRef<HTMLImageElement | null>(null);
   useEffect(() => {
      if (imgRef.current) {
         setFooterHeight(imgRef.current.clientHeight);
      }
   }, []);

   const isDark = theme.palette.mode === "dark";
   return (
      <React.Fragment>
         <Nav
            signedIn={signedIn}
            toggleModal={toggleModal}
            user={user}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            home={true}
            navOpen={false}
            setNavOpen={null}
            overlay={false}
            setOverlay={() => {}}
            searchBar={false}
         />

         <div
            style={{
               position: "relative",
               zIndex: 10,
               marginBottom: `${footerHeight}px`,
               backgroundColor: "var(--background-color)",
            }}
         >
            <ContactMain />

            <div style={{ padding: "0 16px" }}>
               <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
            </div>
         </div>

         <div
            style={{
               backgroundColor: isDark ? "#380e05" : "#fff2d8",
               width: "100%",
               height: `${footerHeight}px`,
               position: "fixed",
               bottom: 0,
               zIndex: 0,
               overflow: "hidden",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
            }}
         >
            <img
               ref={imgRef}
               src={FooterName}
               alt="Fulcrums"
               className="footer-bold-name"
               style={{
                  width: "100%",
                  objectFit: "cover",
               }}
               onLoad={() => {
                  if (imgRef.current) {
                     setFooterHeight(imgRef.current.clientHeight);
                  }
               }}
            />
         </div>
      </React.Fragment>
   );
}

