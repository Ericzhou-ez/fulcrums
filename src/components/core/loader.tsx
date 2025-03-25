import React from "react";

export default function Loader() {
   return (
      <>
         <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
         <div
            style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               gap: "5px",
            }}
         >
            <div
               style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: "#ff9800",
                  animation: "pulse 1.5s infinite ease-in-out",
                  animationDelay: "0s",
               }}
            />
            <div
               style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: "#ff9800",
                  animation: "pulse 1.5s infinite ease-in-out",
                  animationDelay: "0.3s",
               }}
            />
            <div
               style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: "#ff9800",
                  animation: "pulse 1.5s infinite ease-in-out",
                  animationDelay: "0.6s",
               }}
            />
         </div>
      </>
   );
}
