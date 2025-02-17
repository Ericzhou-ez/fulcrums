import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";

export default function Hero() {
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

   return (
      <div className="parallax">
         <div className="light-beam"></div>
         <div
            className="hero-spacer"
            style={{ height: heroHeight, width: "100%" }}
         />

         <div
            ref={heroRef}
            className="hero"
            style={{
               opacity: 1 - scrollProgress * 1.2,
               transform: `scale(${1 - scrollProgress * 0.4})`,
               transformOrigin: "top center",
               position: "fixed",
               width: "100%",
               zIndex: 10,
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
                     md: "6.2rem",
                     lg: "6.5rem",
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
                  marginBottom: "80px",
                  zIndex: 50,
                  fontStyle: "italic",
               }}
               className="hero-h2-description"
            >
               BM-Assist 提供从产品采购到报关全流程管理.
            </Typography>

            <Stack
               spacing={2}
               direction="row"
               justifyContent="center"
               className="cta-buttons"
               marginBottom="100px"
               sx={{ alignItems: "center", gap: { xs: "5px", md: "10px" } }}
            >
               <div className="animated-border">
                  <a href="/">
                     <button className="cta-join-button-hero">理解更多</button>
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
                  <video
                     ref={videoRef}
                     className="hero-video"
                     src="/demo/demo.mp4"
                     autoPlay
                     loop
                     muted
                     playsInline
                     poster="/public/demo/demo-poster.png"
                  />
               </div>
            </div>
         </div>

         <div className="gradient-glow"></div>
      </div>
   );
}
