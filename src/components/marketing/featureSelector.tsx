import { Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

const buttons = ["产品追踪", "报价管理", "海关申报"];
const descriptions = [
   "通过统一管理产品信息, 用户可以在一个系统中完成供应链跟踪, 报价计算和报关申报.",
   "用户可以设定利润比例，系统将根据这些数据计算出最终价格，并自动生成报价单和发票.",
   "输入产品的尺寸、材质、重量和原产地信息，Fulcrums 将根据这些数据自动生成符合中国海关要求的报关单.",
];
interface FeatureSelectorProps { 
   setActiveIndex: (index: number) => void; 
   activeIndex: number; 
}

export default function FeatureSelector({ setActiveIndex, activeIndex }: FeatureSelectorProps) {
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 700);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   useEffect(() => {
      const starContainer = document.querySelector(".star-container-bottom");
      if (!starContainer) return;

      const numStars = 20;
      const stars: HTMLDivElement[] = [];

      for (let i = 0; i < numStars; i++) {
         const star = document.createElement("div");
         star.className = "star";
         star.style.top = `${Math.random() * 100}%`;
         star.style.left = `${Math.random() * 100}%`;

         const size = Math.random() * 2 + 1;
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

   return (
      <Box
         className="hero-description"
         sx={{
            fontSize: {
               xs: "0.78rem",
               sm: "0.88rem",
               lg: "1.15rem",
            },
         }}
      >
         <div className="star-container-bottom"></div>
         <div className="bottom-gradient"></div>

         <div className="feature-selector">
            <div className="video-glow" style={{ opacity: 0.6 }}></div>
            <div
               className="selector-highlight"
               style={{
                  transform: `translateX(${
                     activeIndex * (isMobile ? 90 : 180)
                  }px)`,
               }}
            ></div>

            {buttons.map((text, index) => (
               <button
                  key={index}
                  className={index === activeIndex ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
               >
                  {text}
               </button>
            ))}
         </div>

         <Typography
            variant="subtitle1"
            px={3}
            align="center"
            color="#a6a5a5"
            sx={{
               maxWidth: { xs: "80%", sm: "50%", md: "40%", xl: "30%" },
               fontSize: "inherit",
            }}
         >
            {descriptions[activeIndex]}
         </Typography>
      </Box>
   );
}
