import React from "react";
import { Stack, Box, Typography, Button, Link } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import DescriptionLight from "../../assets/icons/description-light.svg";
import DescriptionDark from "../../assets/icons/description-dark.svg";
import RecentLight from "../../assets/icons/recent-light.svg";
import RecentDark from "../../assets/icons/recent-dark.svg";
import CardSlider from "./cardSlider";
import Footer from "../core/footer";
import { QuickStats10, Chart1 } from "../../components/dashboard/performance";
import {Documentation, Help} from "./help";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import { useEffect } from "react";

const sampleData = [
   { name: "Jan", v1: 34, v2: 3000 },
   { name: "Feb", v1: 48, v2: 4200 },
   { name: "Mar", v1: 72, v2: 9500 },
   { name: "Apr", v1: 58, v2: 7800 },
   { name: "May", v1: 91, v2: 11000 },
   { name: "Jun", v1: 15, v2: 2200 },
   { name: "Jul", v1: 42, v2: 4100 },
   { name: "Aug", v1: 63, v2: 6400 },
   { name: "Sep", v1: 89, v2: 11200 },
   { name: "Oct", v1: 27, v2: 4800 },
   { name: "Nov", v1: 74, v2: 9000 },
   { name: "Dec", v1: 58, v2: 7700 },
];

export default function DashboardOverview() {
   const theme = useTheme();
   const isDarkMode = theme.palette.mode === "dark";
   const {getProducts, products, errorMessages, loading} = useProductSupplierClientContext();

   useEffect(() => {
      getProducts();
   }, []);

   return (
      <div className="dashboard-overview">
         <Box>
            <Stack spacing={4}>
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
                        总览
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

               <QuickStats10 />
               <Chart1 />

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

                  <CardSlider isDarkMode={isDarkMode} isRecent={true} products={products} />
               </Box>

               {/* “保存” section */}
               {/* <Box sx={{ my: 2 }}>
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
               </Box> */}
            </Stack>

            <div className="help-container">
               <Help />
               <Documentation />
            </div>
         </Box>

         <Footer />
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
