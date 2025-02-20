"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CTADark from "../../assets/images/home-cta-dark.png";
import CTALight from "../../assets/images/home-cta-light.png";
import Triangle from "../../assets/images/home-rectangles.svg";
import Cosmic from "../../assets/images/home-cosmic.svg";

interface BottomCTAProps {
   theme: any;
}

export default function BottomCTA({ theme }: BottomCTAProps) {
   const isDark = theme.palette.mode === "dark";

   return (
      <Box>
         <Container>
            <Box
               sx={{
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  overflow: "hidden",
                  position: "relative",
               }}
            >
               <Box
                  sx={{
                     bgcolor: "#171723",
                     borderRadius: "20px",
                     position: "absolute",
                     inset: 0,
                     zIndex: 0,
                  }}
               >
                  <Box
                     sx={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                     }}
                  >
                     <Box
                        component="img"
                        src={Cosmic}
                        sx={{ height: "auto", width: "1600px" }}
                     />
                  </Box>

                  <Box
                     sx={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                     }}
                  >
                     <Box
                        component="img"
                        src={Triangle}
                        sx={{ height: "auto", width: "1900px" }}
                     />
                  </Box>
               </Box>

               <Stack
                  spacing={3}
                  sx={{
                     flex: "0 1 auto",
                     position: "relative",
                     py: {
                        xs: "50px",
                        sm: "80px",
                        md: "100px",
                     },
                     px: {
                        xs: "20px",
                        sm: "40px",
                        md: "60px",
                     },
                     width: { xs: "100%", md: "45%" },
                     zIndex: 1,
                  }}
               >
                  <Stack spacing={2}>
                     <Typography
                        color="inherit"
                        variant="h3"
                        sx={{
                           fontWeight: 700,
                           fontSize: {
                              xs: "2.2rem",
                              sm: "2.5rem",
                              md: "3rem",
                              lg: "3.5rem",
                           },
                        }}
                     >
                        一键化繁为简
                     </Typography>
                     <Typography
                        sx={{
                           color: "#ddd",
                           paddingTop: "30px",
                           fontSize: {
                              xs: "0.9rem",
                              sm: "1rem",
                              md: "1.1rem",
                              lg: "1.2rem",
                           },
                        }}
                     >
                        无论是海量产品采购, 还是生成 Excel/PDF 报价, Fulcrums
                        都能为您简化流程, 节省时间.
                     </Typography>
                  </Stack>
                  <div>
                     <Button
                        href="/dashboard"
                        target="_blank"
                        variant="contained"
                        className="cta-bottom-btn"
                     >
                        尝试
                     </Button>
                  </div>
               </Stack>

               {/* Right side image content */}
               <Box
                  sx={{
                     alignItems: { xs: "flex-end", md: "stretch" },
                     borderRadius: "20px",
                     display: "flex",
                     flex: "1 1 auto",
                     flexDirection: "column",
                     justifyContent: "flex-end",
                     pl: { xs: "64px", md: 0 },
                     position: "relative",
                     zIndex: 2,
                  }}
               >
                  <Box
                     sx={{
                        height: "340px",
                        position: "relative",
                        width: { xs: "80%", md: "100%" },
                        backdropFilter: "blur(15px)",
                     }}
                  >
                     <Box
                        className="glass-morph"
                        sx={{
                           bgcolor: "#fa8c48",
                           filter: "blur(50px) !important",
                           WebkitBackdropFilter: "blur(50px) !important",
                           height: "40px",
                           position: "absolute",
                           inset: "0",
                           zIndex: 0,
                        }}
                     />
                     <Box
                        sx={{
                           height: "100%",
                           position: "relative",
                           width: "100%",
                           zIndex: 1,
                        }}
                     >
                        <Box
                           component="img"
                           src={isDark ? CTADark : CTALight}
                           sx={{
                              display: "block",
                              height: "100%",
                              width: "auto",
                              position: "absolute",
                              inset: 0,
                           }}
                        />
                     </Box>
                  </Box>
               </Box>
            </Box>
         </Container>
      </Box>
   );
}
