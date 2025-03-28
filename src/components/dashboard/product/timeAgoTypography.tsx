import React from "react";
import { Typography } from "@mui/material";

interface TimeAgoTypographyProps {
   timestamp: string; // ISO 
}

const formatDate = (date: Date) => {
   const y = date.getFullYear();
   const m = date.getMonth() + 1;
   const d = date.getDate();
   return `${m}月${d}日, ${y}`;
};

const TimeAgoTypography: React.FC<TimeAgoTypographyProps> = ({ timestamp }) => {
   const now = new Date();
   const past = new Date(timestamp);
   const diffMs = now.getTime() - past.getTime();
   const diffMin = Math.floor(diffMs / 60000);
   const diffHour = Math.floor(diffMin / 60);
   const diffDay = Math.floor(diffHour / 24);

   let display = "";

   if (diffMin < 1) {
      display = "1分钟前"; 
   } else if (diffMin < 60) {
      display = `${diffMin}分钟前`; 
   } else if (diffHour < 24) {
      display = `${diffHour}小时前`; 
   } else if (diffDay === 1) {
      display = "昨天";
   } else {
      display = formatDate(past);
   }

   return <Typography color="text.secondary" fontSize="0.8rem" fontWeight={400}>{display}</Typography>;
};

export default TimeAgoTypography;
