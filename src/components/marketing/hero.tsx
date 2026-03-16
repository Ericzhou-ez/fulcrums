import { Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";

import { useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";

import borderDemoImg from "../../assets/images/border_demo.png";
import productDemoImg from "../../assets/images/product_demo.png";
import quotationDemoImg from "../../assets/images/quotation_demo.png";

const demoVideo = [borderDemoImg, productDemoImg, quotationDemoImg];

interface HeroProps {
   activeIndex: number;
}

export default function Hero({ activeIndex = 0 }: HeroProps) {
   const location = useLocation();
   const theme = useTheme();
   const isLg = useMediaQuery(theme.breakpoints.only("lg"));
   const isMd = useMediaQuery(theme.breakpoints.only("md"));
   const isSm = useMediaQuery(theme.breakpoints.only("sm"));
   const isXs = useMediaQuery(theme.breakpoints.only("xs"));

   let initialHeroHeight;
   if (isLg) {
      initialHeroHeight = 900;
   } else if (isMd) {
      initialHeroHeight = 540;
   } else if (isSm) {
      initialHeroHeight = 320;
   } else if (isXs) {
      initialHeroHeight = 300;
   } else {
      initialHeroHeight = 500;
   }

   const [scrollProgress, setScrollProgress] = useState(0);
   const [heroHeight, setHeroHeight] = useState(initialHeroHeight);
   const heroRef = useRef<HTMLDivElement>(null);
   const videoRef = useRef<HTMLVideoElement>(null);

   useEffect(() => {
      const updateHeroHeight = () => {
         if (heroRef.current) {
            setHeroHeight(heroRef.current.offsetHeight);
         }
      };

      updateHeroHeight();
      window.addEventListener("resize", updateHeroHeight);
      return () => window.removeEventListener("resize", updateHeroHeight);
   }, []);

   useEffect(() => {
      let ticking = false;
      const lastScroll = { progress: 0 };

      const handleScroll = () => {
         if (!ticking) {
            requestAnimationFrame(() => {
               const scrollY = window.scrollY;
               const progress = Math.min(scrollY / heroHeight, 1);

               if (Math.abs(progress - lastScroll.progress) > 0.005) {
                  lastScroll.progress = progress;
                  setScrollProgress(progress);
               }

               if (progress > 0.5) {
                  videoRef.current?.play();
               } else {
                  videoRef.current?.pause();
               }

               ticking = false;
            });

            ticking = true;
         }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
   }, [heroHeight]);

   const computedOpacity = 1.1 - scrollProgress * 1.2;

   return (
      <React.Fragment>
         <div className="parallax">
            <div
               className="hero-spacer"
               style={{ height: heroHeight, width: "100%" }}
            />

            <div
               ref={heroRef}
               className="hero"
               style={{
                  opacity: computedOpacity < 0 ? 0 : computedOpacity,
                  zIndex: computedOpacity < 0.03 ? "-5" : "5",
                  transform: `scale(${1 - scrollProgress * 0.4})`,
                  transformOrigin: "top center",
                  position: "fixed",
                  width: "100%",
               }}
            >
               <Typography
                  variant="h1"
                  component="h1"
                  align="center"
                  sx={{
                     fontSize: {
                        xs: "3.8rem",
                        sm: "4.8rem",
                        md: "6.2rem",
                        lg: "6.6rem",
                     },
                     fontWeight: 700,
                     lineHeight: 1.2,
                     color: "#fff",
                     margin: "0 15px",
                     marginBottom: "20px",
                     letterSpacing: "0.08rem",
                  }}
                  className="hero-title hero-title-animate"
               >
                  从报价到<span style={{ whiteSpace: "nowrap" }}>报关</span>
                  <br />
                  <span className="clipped-text">一键搞定!</span>
               </Typography>

               <Typography
                  variant="h2"
                  align="center"
                  sx={{
                     fontSize: {
                        xs: "0.8rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.4rem",
                     },
                     fontWeight: "600",
                     color: "#fcfcfc",
                     marginBottom: { xs: "20px", md: "50px" },
                     zIndex: 100,
                     fontStyle: "italic",
                  }}
                  className="hero-h2-description"
               >
                  Fulcrums 让产品追踪，报价，报关从未如此轻松.
               </Typography>

               <Stack
                  spacing={2}
                  direction="row"
                  justifyContent="center"
                  className="cta-buttons"
                  sx={{
                     alignItems: "center",
                     gap: { xs: "5px", md: "10px" },
                     marginBottom: { xs: "40px", md: "100px" },
                  }}
               >
                  <a href="/signin">
                     <button className="cta-login">登录</button>
                  </a>

                  <a href="/">
                     <button className="cta-join-button-hero">
                        理解更多<span className="arrow">→</span>
                     </button>
                  </a>
               </Stack>
            </div>

            <div className="hero-video-wrapper">
               <div className="video-glow" key={location.pathname}></div>

               <div
                  className="video-container"
                  style={{
                     transform: `scale(${1 + scrollProgress * 0.08})`,
                  }}
               >
                  <div className="video-inner">
                     {activeIndex === -2 ? (
                        <video
                           ref={videoRef}
                           className="hero-video"
                           src={demoVideo[activeIndex]}
                           autoPlay
                           loop
                           muted
                           playsInline
                           poster="/demo/demo-poster.png"
                        />
                     ) : (
                        <img
                           className="hero-demo-img"
                           src={demoVideo[activeIndex]}
                           alt="img"
                        />
                     )}
                  </div>
               </div>
            </div>

            <div className="gradient-glow"></div>
         </div>
      </React.Fragment>
   );
}
