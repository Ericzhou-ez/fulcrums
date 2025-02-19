import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";

const demoVideo = [
   "https://github.githubassets.com/assets/code-1_desktop-7ab52aea3358.mp4",
   "https://github.githubassets.com/assets/secure-1_desktop-5a462aa7c6a6.webp",
   "https://github.githubassets.com/assets/plan-1_desktop-849e8cffdf0b.webp",
];

interface HeroProps { 
   activeIndex: number; 
}

export default function Hero({ activeIndex = 0 }: HeroProps) {
   const [scrollProgress, setScrollProgress] = useState(0);
   const [heroHeight, setHeroHeight] = useState(0);
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
      const handleScroll = () => {
         const scrollY = window.scrollY;
         const progress = Math.min(scrollY / heroHeight, 1);
         setScrollProgress(progress);

         if (progress > 0.5) {
            videoRef.current?.play();
         } else {
            videoRef.current?.pause();
         }
      };

      window.addEventListener("scroll", handleScroll);
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
                        xs: "4rem",
                        sm: "4.8rem",
                        md: "6.5rem",
                        lg: "7.2rem",
                     },
                     fontWeight: 700,
                     lineHeight: 1.2,
                     color: "#fff",
                     margin: "0 15px",
                     marginBottom: "20px",
                     letterSpacing: "0.08rem",
                  }}
                  className="hero-title"
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
                  <div className="animated-border">
                     <a href="/">
                        <button className="cta-join-button-hero">
                           理解更多
                        </button>
                     </a>
                  </div>
                  <a href="/signin">
                     <button className="cta-login">登录</button>
                  </a>
               </Stack>
            </div>

            <div className="hero-video-wrapper">
               <div className="video-glow"></div>

               <div
                  className="video-container"
                  style={{
                     transform: `scale(${1 + scrollProgress * 0.1})`,
                  }}
               >
                  <div className="video-inner">
                     {activeIndex === 0 ? (
                        <video
                           ref={videoRef}
                           className="hero-video"
                           src={demoVideo[activeIndex]}
                           autoPlay
                           loop
                           muted
                           playsInline
                           poster="/public/demo/demo-poster.png"
                        />
                     ) : (
                        <img className="hero-demo-img" src={demoVideo[activeIndex]}
                        alt="img" />
                     )}
                  </div>
               </div>
            </div>

            <div className="gradient-glow"></div>
         </div>
      </React.Fragment>
   );
}
