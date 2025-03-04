import { Box, Typography, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../../styles/contact.css";
import LinkedInIcon from "../../assets/icons/linkedinIcon.svg";
import InstagramIcon from "../../assets/icons/instagramIcon.svg";
import EmailIcon from "../../assets/icons/mailboxIcon.svg";

export default function ContactMain() {
   const theme = useTheme();
   const borderColor =
      theme.palette.mode === "dark"
         ? "rgba(255, 255, 255, 0.2)"
         : "rgba(0, 0, 0, 0.2)";
   const textColor =
      theme.palette.mode === "dark"
         ? "rgba(255, 255, 255, 0.7)"
         : "rgba(0, 0, 0, 0.7)";

   return (
      <Box
         sx={{
            paddingTop: "120px",
            width: { xs: "90%", md: "80%" },
            maxWidth: "1400px",
            margin: "0 auto",
         }}
      >
         <div
            className="dot-mask-container"
            style={{
               border: `0.5px solid ${borderColor}`,
               position: "relative",
               borderTopRightRadius: "20px",
               borderBottomLeftRadius: "20px",
            }}
         >
            <div
               style={{
                  position: "absolute",
                  width: "15px",
                  height: "15px",
                  borderColor: borderColor,
                  top: "-15px",
                  left: "-15px",
                  borderLeft: "0.5px solid",
                  borderTop: "0.5px solid",
                  transform: "rotate(180deg)",
               }}
            ></div>
            <div
               style={{
                  position: "absolute",
                  width: "15px",
                  height: "15px",
                  borderColor: borderColor,
                  bottom: "-15px",
                  right: "-15px",
                  borderRight: "0.5px solid",
                  borderBottom: "0.5px solid",
                  transform: "rotate(180deg)",
               }}
            ></div>

            <Box alignContent="center" className="dot-mask">
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
                  Contact Us.
               </Typography>
            </Box>
         </div>

         <Box mt={3}>
            <Grid container justifyContent="center" alignItems="stretch">
               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                     }}
                  >
                     <img
                        src={LinkedInIcon}
                        alt="LinkedIn"
                        className="contact-icon"
                        style={{
                           width: "35px",
                           filter:
                              theme.palette.mode === "dark"
                                 ? "invert(100%)"
                                 : "none",
                        }}
                     />
                     <Typography
                        variant="body1"
                        sx={{
                           fontWeight: 700,
                           color: "text.primary",
                           display: "inline",
                        }}
                     >
                        Connect with me{" "}
                        <Typography
                           variant="body2"
                           sx={{
                              color: textColor,
                              fontWeight: 400,
                              display: "inline",
                           }}
                        >
                           on LinkedIn to exchange ideas and explore
                           opportunities.
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "15px",
                           fontSize: "0.9rem",
                           textTransform: "none",
                           padding: "5px 20px",
                           borderRadius: "30px",
                           border: `0.5px solid ${borderColor}`,
                        }}
                        onClick={() =>
                           window.open(
                              "https://www.linkedin.com/in/eric-zhou-ez/",
                              "_blank"
                           )
                        }
                     >
                        Connect with me
                     </Button>
                  </Box>
               </Grid>

               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                     }}
                  >
                     <img
                        src={InstagramIcon}
                        alt="Instagram"
                        className="contact-icon"
                        style={{
                           width: "40px",
                           filter:
                              theme.palette.mode === "dark"
                                 ? "invert(100%)"
                                 : "none",
                        }}
                     />
                     <Typography
                        variant="body1"
                        sx={{
                           fontWeight: 700,
                           color: "text.primary",
                           display: "inline",
                        }}
                     >
                        See what I’m up to.{" "}
                        <Typography
                           variant="body2"
                           sx={{
                              color: textColor,
                              fontWeight: 400,
                              display: "inline",
                           }}
                        >
                           Follow me on Instagram for insights, updates, and a
                           glimpse behind the scenes.
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "15px",
                           fontSize: "0.9rem",
                           textTransform: "none",
                           padding: "5px 20px",
                           borderRadius: "30px",
                           border: `0.5px solid ${borderColor}`,
                        }}
                        onClick={() =>
                           window.open(
                              "https://www.instagram.com/eric_zh0u/",
                              "_blank"
                           )
                        }
                     >
                        Follow @eric_zh0u
                     </Button>
                  </Box>
               </Grid>

               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                     }}
                  >
                     <img
                        src={EmailIcon}
                        alt="Email"
                        className="contact-icon"
                        style={{
                           width: "40px",
                           filter:
                              theme.palette.mode === "dark"
                                 ? "invert(100%)"
                                 : "none",
                        }}
                     />
                     <Typography
                        variant="body1"
                        sx={{
                           fontWeight: 700,
                           color: "text.primary",
                           display: "inline",
                        }}
                     >
                        Let’s make things happen.{" "}
                        <Typography
                           variant="body2"
                           sx={{
                              color: textColor,
                              fontWeight: 400,
                              display: "inline",
                           }}
                        >
                           Reach out via email for inquiries related to
                           Fulcrums.
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "15px",
                           fontSize: "0.9rem",
                           textTransform: "none",
                           padding: "5px 20px",
                           borderRadius: "30px",
                           border: `0.5px solid ${borderColor}`,
                        }}
                        onClick={() =>
                           window.open("mailto:zhoueric882@gmail.com", "_blank")
                        }
                     >
                        Contact me
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </Box>
      </Box>
   );
}
