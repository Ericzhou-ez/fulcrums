import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";

export default function Hero() {
   const [scrollProgress, setScrollProgress] = useState(0);
   const videoRef = useRef<HTMLVideoElement>(null);

   useEffect(() => {
      const handleScroll = () => {
         const scrollY = window.scrollY;
         const heroHeight =
            (document.querySelector(".hero") as HTMLElement)?.offsetHeight || 600;
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
   }, []);

   return (
      <div className="parallax">
         <div
            className="hero"
            style={{
               opacity: 1 - scrollProgress,
               transform: `scale(${1 - scrollProgress * 0.2})`,
               transformOrigin: "top center", // Keeps the hero from moving up
               position: "relative", // Ensures no unexpected shifts
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
               marginBottom="50px"
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
                     poster="/demo/demo-poster.jpg"
                  />
               </div>
            </div>
         </div>

         <div className="gradient-glow"></div>
      </div>
   );
}
