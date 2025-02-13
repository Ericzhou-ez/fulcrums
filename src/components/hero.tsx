import { Typography } from "@mui/material";

export default function Hero() {
   return (
      <Typography
         variant="h1"
         component="h1"
         align="center"
         sx={{
            fontSize: {
               xs: "3.4rem", 
               sm: "5.5rem", 
               md: "6.2rem", 
               lg: "7rem", 
            },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "text.primary",
            margin: "0 40px",
         }}
      >
         一键搞定<br></br>产品追踪,<br></br>报价, 报关.
      </Typography>
   );
}
