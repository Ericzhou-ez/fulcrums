import React from "react";

const Loading = () => {
   return (
      <div
         style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "4px",
            background: "linear-gradient(to right, #ff4500, #ff8000)", 
            zIndex: 9999,
            overflow: "hidden",
         }}
      >
         <div
            style={{
               width: "100%",
               height: "100%",
               background: "linear-gradient(to right, #ff6500, #ff9500)",
               transformOrigin: "left",
               animation: "loadingBar 1.5s infinite ease-in-out",
            }}
         />
         <style>
            {`
               @keyframes loadingBar {
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(20%); }
                  100% { transform: translateX(100%); }
               }
            `}
         </style>
      </div>
   );
};

export default Loading;
