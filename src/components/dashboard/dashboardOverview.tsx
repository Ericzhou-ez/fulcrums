import React from "react";
import { Stack, Box, Typography, Button, Link } from "@mui/material";
import { Theme } from "@mui/material/styles";
import DescriptionLight from "../../assets/icons/description-light.svg";
import DescriptionDark from "../../assets/icons/description-dark.svg";
import RecentLight from "../../assets/icons/recent-light.svg";
import RecentDark from "../../assets/icons/recent-dark.svg";
import AddLightBtn from "../../assets/icons/add-light.svg";
import CardSlider from "./cardSlider";
import Footer from "../core/footer";

interface DashboardOverviewProps {
   theme: any;
   handleToggleTheme: () => void;
}

export default function DashboardOverview({ theme, handleToggleTheme }: DashboardOverviewProps) {
   const isDarkMode = theme.palette.mode === "dark";

   return (
      <div className="dashboard-overview">
         <Box px={2}>
            <Stack spacing={4}>
               {/* Header section */}
               <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
                  <Box style={{ flex: "1 1 auto" }}>
                     <Typography
                        variant="h1"
                        sx={{
                           fontSize: {
                              xs: "3rem",
                              sm: "3.2rem",
                              md: "3.5rem",
                              lg: "4rem",
                              fontWeight: "400",
                           },
                        }}
                     >
                        概括
                     </Typography>
                  </Box>
                  {/* <Stack spacing={2} direction="column">
                     <Button variant="contained" className="excel-button">
                        导出为Excel
                     </Button>
                     <Button variant="contained" className="pdf-button">
                        导出为PDF
                     </Button>
                  </Stack> */}
               </Stack>

               <div className="gradient-divider"></div>

               <Box sx={{ my: 2 }}>
                  <Link href="/recent">
                     <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1, borderRadius: "20px", cursor: "pointer" }}
                     >
                        {isDarkMode ? (
                           <img
                              src={DescriptionDark}
                              alt="Description Icon"
                              width={25}
                              height={25}
                           />
                        ) : (
                           <img
                              src={DescriptionLight}
                              alt="Description Icon"
                              width={25}
                              height={25}
                           />
                        )}
                        <Typography variant="h5" fontSize="1.3rem">
                           最近 &gt;
                        </Typography>
                     </Stack>
                  </Link>

                  {/* <SimpleSlider /> */}

                  <CardSlider isDarkMode={isDarkMode} isRecent={true} />
               </Box>

               {/* “保存” section */}
               <Box sx={{ my: 2 }}>
                  <Link href="/saved">
                     <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1, cursor: "pointer" }}
                     >
                        {isDarkMode ? (
                           <img
                              src={RecentDark}
                              alt="Recent Icon"
                              width={25}
                              height={25}
                           />
                        ) : (
                           <img
                              src={RecentLight}
                              alt="Recent Icon"
                              width={25}
                              height={25}
                           />
                        )}
                        <Typography variant="h5" fontSize="1.3rem">
                           保存 &gt;
                        </Typography>
                     </Stack>
                  </Link>

                  <CardSlider isDarkMode={isDarkMode} isRecent={false} />
               </Box>
            </Stack>

            <button className="add-product">
               <img src={AddLightBtn} alt="+" />
            </button>
         </Box>

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </div>
   );
}

function SimpleSlider() {
   return (
      <Box
         sx={{
            width: "100%",
            overflowX: "auto",
            display: "flex",
            flexWrap: "nowrap",
            gap: 2,
            border: "1px solid red",
            p: 2,
            // Hide scrollbar in Chrome/Firefox (optional):
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
               display: "none", // Chrome, Safari
            },
         }}
      >
         <Box
            sx={{
               flex: "0 0 auto",
               minWidth: "400px",
               height: "150px",
               backgroundColor: "lightblue",
            }}
         />
         <Box
            sx={{
               flex: "0 0 auto",
               minWidth: "400px",
               height: "150px",
               backgroundColor: "lightgreen",
            }}
         />
         <Box
            sx={{
               flex: "0 0 auto",
               minWidth: "400px",
               height: "150px",
               backgroundColor: "lightcoral",
            }}
         />
         <Box
            sx={{
               flex: "0 0 auto",
               minWidth: "400px",
               height: "150px",
               backgroundColor: "lightgoldenrodyellow",
            }}
         />
      </Box>
   );
}
