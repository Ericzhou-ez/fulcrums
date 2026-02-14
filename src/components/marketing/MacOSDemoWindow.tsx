import React, { ReactNode } from "react";
import "../../styles/home.css";

interface MacOSDemoWindowProps {
   children: ReactNode;
   className?: string;
}

export default function MacOSDemoWindow({ children, className = "" }: MacOSDemoWindowProps) {
   return (
      <div className={`macos-demo-window ${className}`.trim()}>
         <div className="macos-demo-window-titlebar">
            <div className="macos-demo-window-buttons">
               <span className="macos-demo-btn macos-demo-btn-close" />
               <span className="macos-demo-btn macos-demo-btn-minimize" />
               <span className="macos-demo-btn macos-demo-btn-maximize" />
            </div>
            <span className="macos-demo-window-title">Fulcrums</span>
         </div>
         <div className="macos-demo-window-content">{children}</div>
      </div>
   );
}
