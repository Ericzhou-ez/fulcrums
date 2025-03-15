import React, { useEffect, useState, useRef } from "react";
import Footer from "../../components/core/footer";
import Hero from "../../components/marketing/hero";
import Nav from "../../components/core/nav";
import "../../styles/home.css";
import BottomCTA from "../../components/marketing/bottomCta";
import { Faqs } from "../../components/marketing/faqs";
import FeatureSelector from "../../components/marketing/featureSelector";
import FooterName from "../../assets/images/footerName.svg";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { useMediaQuery } from "@mui/material";

const Home = () => {
   const [footerHeight, setFooterHeight] = useState(0);
   const imgRef = useRef<HTMLImageElement | null>(null);
   const [activeIndex, setActiveIndex] = useState(1);

   useEffect(() => {
      const starContainer = document.querySelector(".star-container");
      if (!starContainer) return;
      const numStars = 100;
      const stars: HTMLDivElement[] = [];

      for (let i = 0; i < numStars; i++) {
         const star = document.createElement("div");
         star.className = "star";

         star.style.top = `${Math.random() * 100}%`;
         star.style.left = `${Math.random() * 100}%`;

         const size = Math.random() * 3 + 1;
         star.style.width = `${size}px`;
         star.style.height = `${size}px`;
         const duration = Math.random() * 5 + 3;
         star.style.animationDuration = `${duration}s`;

         starContainer.appendChild(star);
         stars.push(star);
      }

      return () => {
         stars.forEach((star) => star.remove());
      };
   }, []);

   useEffect(() => {
      if (imgRef.current) {
         setFooterHeight(imgRef.current.clientHeight);
      }
   }, []);

   useEffect(() => {
      document.title = "Fulcrums";
   }, []);

   const { isDark } = useThemeContext();

   return (
      <React.Fragment>
         <div
            style={{
               position: "relative",
               zIndex: 10,
               marginBottom: `${footerHeight}px`,
               backgroundColor: "var(--background-color)",
            }}
         >
            <div className="home">
               <div className="star-container"></div>
               <Nav home={true} searchBar={false} />
               <Hero activeIndex={activeIndex} />{" "}
            </div>

            <FeatureSelector
               activeIndex={activeIndex}
               setActiveIndex={setActiveIndex}
            />

            <Faqs />

            <BottomCTA />

            <div style={{ padding: "0 16px" }}>
               <Footer />
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
};

export default Home;
