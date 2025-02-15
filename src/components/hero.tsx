import { Stack, Typography } from "@mui/material";

export default function Hero() {
   return (
      <div className="hero">
         <Typography
            variant="h1"
            component="h1"
            align="center"
            sx={{
               fontSize: {
                  xs: "3.5rem",
                  sm: "4.5rem",
                  md: "6.2rem",
                  lg: "6.5rem",
               },
               fontWeight: 700,
               lineHeight: 1.2,
               color: "text.primary",
               margin: "0 10px",
               marginBottom: "20px",
               letterSpacing: "0.1rem",
            }}
            className="hero-title"
         >
            报价到报关<br></br>
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
               color: "text.secondary",
               marginBottom: "80px",
               fontStyle: "italic"
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
            gap="5px"
            marginBottom="50px"
            sx={{alignItems: "center"}}
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
   );
}
