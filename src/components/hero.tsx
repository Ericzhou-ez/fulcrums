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
                  xs: "3.1rem",
                  sm: "4.5rem",
                  md: "6.2rem",
                  lg: "6.5rem",
               },
               fontWeight: 700,
               lineHeight: 1.2,
               color: "text.primary",
               margin: "0 40px",
               marginBottom: "20px",
               letterSpacing: "0.05rem",
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
                  xs: "0.7rem",
                  sm: "1rem",
                  md: "1.2rem",
                  lg: "1.4rem",
               },
               fontWeight: "600",
               color: "text.secondary",
               marginBottom: "30px",
            }}
            className="hero-h2-description"
         >
            BT-Assist 提供从产品采购到报关全流程管理.
         </Typography>

         <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            className="cta-buttons"
            gap="10px"
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
