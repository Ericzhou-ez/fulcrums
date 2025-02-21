import React from "react";
import { Typography } from "@mui/material";
import {
   FileText as FileTextIcon,
   ChatTeardropText as ChatTeardropTextIcon,
} from "phosphor-react";

interface HelpProps {
   action: React.ReactNode;
   description: string;
   icon: React.ElementType;
   label: string;
   title: string;
}

export function Help() {
   return (
      <div className="help-card">
         <div>
            <FileTextIcon size={22}  />
            <Typography className="help-title" fontWeight={600} >
               使用说明
            </Typography>
         </div>
         <Typography className="help-description">
            查看完整文档，以获取更多示例和最佳实践.
         </Typography>
         <button className="help-btn">查看文档</button>
      </div>
   );
}

export function Documentation() {
   return (
      <div className="help-card">
         <div>
            <ChatTeardropTextIcon size={22} />
            <Typography className="help-title" fontWeight={600}>
               联系我们
            </Typography>
         </div>
         <Typography className="help-description">
            如需帮助或反馈，请随时与我们取得联系.
         </Typography>
         <button className="help-btn">联系我们</button>
      </div>
   );
}
