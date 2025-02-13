import React from "react";
import "@theme-toggles/react/css/Classic.css";
import { Classic } from "@theme-toggles/react";
import "../styles/footer.css";
import HomeLight from "../assets/icons/home-light.svg";
import HomeDark from "../assets/icons/home-dark.svg";
import DescriptionLight from "../assets/icons/description-light.svg";
import DescriptionDark from "../assets/icons/description-dark.svg";
import RecentLight from "../assets/icons/recent-light.svg";
import RecentDark from "../assets/icons/recent-dark.svg";
import HeartLight from "../assets/icons/heart-light.svg";
import HeartDark from "../assets/icons/heart-dark.svg";
import Logo from "../assets/images/logo.svg";
import { Typography } from "@mui/material";
import ThemeSwitch from "./themeSwitch";
import { Link } from "react-router-dom";

const Footer = ({ theme, handleToggleTheme }) => {
   const isDark = theme === "dark";

   return (
      <footer className="footer">
         <div className="footer-divider"></div>

         <div className="footer-bottom">
            <div className="footer-logo">
               <img src={Logo} alt="logo" />
               <h6>BT-Assist</h6>
            </div>

            <div className="icon-container">
               <Link to="/">
                  <img src={isDark ? HomeDark : HomeLight} alt="Home" />
               </Link>

               <Link to="/">
                  <img
                     src={isDark ? DescriptionDark : DescriptionLight}
                     alt="Notes"
                  />
               </Link>

               <Link to="/">
                  <img src={isDark ? RecentDark : RecentLight} alt="Recent" />
               </Link>

               <Link to="/">
                  <img src={isDark ? HeartDark : HeartLight} alt="Saved" />
               </Link>

               <div className="theme-btn-container">
                  <ThemeSwitch
                     handleToggleTheme={handleToggleTheme}
                     theme={theme}
                  />
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
