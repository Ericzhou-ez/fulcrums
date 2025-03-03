import { Box, Typography } from "@mui/material";
import "../../styles/contact.css"

export default function ContactMain() {
   return (
      <div style={{ marginTop: "120px" }}>
         <div className="dot-mask-container">
            <Box alignContent={"center"} className="dot-mask">
               <Typography
                  className="contact-bubble"
                  variant="h1"
                  sx={{
                     fontSize: {
                        xs: "2.8rem",
                        sm: "4rem",
                        md: "5rem",
                        lg: "6rem",
                     },
                     fontWeight: 600,
                     pt: { xs: "30px", md: "50px" },
                     pb: { xs: "30px", md: "50px" },
                  }}
               >
                  联系我们
               </Typography>
            </Box>
         </div>
      </div>
   );
}