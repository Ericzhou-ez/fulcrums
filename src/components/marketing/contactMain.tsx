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
                  borderLeft: `0.5px solid ${borderColor}`,
                  borderTop: `0.5px solid ${borderColor}`,
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
                  borderRight: `0.5px solid ${borderColor}`,
                  borderBottom: `0.5px solid ${borderColor}`,
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
                  联系我们.
               </Typography>
            </Box>
         </div>

         <Box mt={2}>
            <Grid container justifyContent="center" alignItems="stretch">
               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px 40px",
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
                           fontWeight: 500,
                           color: "text.primary",
                           display: "inline",
                        }}
                     >
                        与我建立联系
                        <Typography
                           variant="body1"
                           sx={{
                              color: textColor,
                              fontWeight: 400,
                              display: "inline",
                           }}
                        >
                           在LinkedIn上与我交流想法并探索更多机会。
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "20px",
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
                        联系
                     </Button>
                  </Box>
               </Grid>

               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px 40px",
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
                           fontWeight: 500,
                           color: "text.primary",
                           display: "inline",
                        }}
                     >
                        关注我的Instagram动态
                        <Typography
                           variant="body1"
                           sx={{
                              color: textColor,
                              fontWeight: 400,
                              display: "inline",
                           }}
                        >
                           来获取最新动态和幕后故事。
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "20px",
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
                        关注 @eric_zh0u
                     </Button>
                  </Box>
               </Grid>

               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px 40px",
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
                           fontWeight: 500,
                           color: "text.primary",
                           display: "inline",
                        }}
                     >
                        让我们一起创造更多可能;{" "}
                        <Typography
                           variant="body1"
                           sx={{
                              color: textColor,
                              fontWeight: 400,
                              display: "inline",
                           }}
                        >
                           通过电子邮件联系我，咨询Fulcrums相关事宜。
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "20px",
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
                        联系我
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </Box>

         <Grid
            container
            spacing={12}
            mt={2}
            sx={{
               width: "100%",
               maxWidth: "1400px",
               mx: "auto",
            }}
         >
            <Grid
               item
               xs={12}
               lg={8}
               sx={{
                  border: `0.5px solid ${borderColor}`,
                  padding: "30px 40px !important",
               }}
            >
               <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap={4}
               >
                  <Typography
                     sx={{
                        fontWeight: "600",
                        fontSize: "1.4rem",
                        width: "80%",
                     }}
                     color="GrayText"
                  >
                     <Typography
                        color="text.primary"
                        sx={{
                           fontWeight: "600",
                           fontSize: "1.4rem",
                           display: "inline",
                        }}
                     >
                        不确定该选择哪个方案?{" "}
                     </Typography>
                     欢迎与我们讨论
                     <span style={{ color: "#0071e3" }}>免费版</span>或
                     <span style={{ color: "#ff7c00" }}>企业版</span>
                     的需求，了解定制定价方案，或者申请产品演示。
                  </Typography>

                  <Button
                     variant="contained"
                     color="info"
                     sx={{ width: "fit-content" }}
                  >
                     预约演示
                  </Button>
               </Box>
            </Grid>
            <Grid
               item
               xs={12}
               lg={4}
               sx={{
                  padding: "30px 40px !important",
                  border: `0.5px solid ${borderColor}`,
               }}
            >
               <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap={3}
               >
                  <Typography
                     sx={{
                        fontWeight: "600",
                        fontSize: "1.4rem",
                        width: "80%",
                     }}
                     color="text.primary"
                  >
                     <Typography
                        color="GrayText"
                        sx={{
                           fontWeight: "600",
                           fontSize: "1.4rem",
                           display: "inline",
                        }}
                     >
                        通过互动产品导览，试用或个性化演示，
                     </Typography>
                     探索Fulcrums企业版.
                  </Typography>

                  <Button
                     variant="contained"
                     color="info"
                     size="small"
                     sx={{ width: "fit-content"}}
                  >
                     了解企业版
                  </Button>
               </Box>
            </Grid>
         </Grid>
      </Box>
   );
}
