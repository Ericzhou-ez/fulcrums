import React from "react";
import { Stack, Box, Grid, Typography, Button } from "@mui/material";
import { Theme } from "@mui/material/styles";
import DescriptionLight from "../assets/icons/description-light.svg";
import DescriptionDark from "../assets/icons/description-dark.svg";
import RecentLight from "../assets/icons/recent-light.svg";
import RecentDark from "../assets/icons/recent-dark.svg";

interface DashboardOverviewProps {
   theme: Theme;
}

export default function DashboardOverview({ theme }: DashboardOverviewProps) {
   const isDarkMode = theme.palette.mode === "dark";

   return (
      <Stack spacing={4} sx={{ margin: "0 20px" }}>
         <Stack direction="row" spacing={3} sx={{ alignItems: "flex-start" }}>
            <Box sx={{ flex: "1 1 auto" }}>
               <Typography variant="h1" fontSize="4rem">
                  概括
               </Typography>
            </Box>
            <Stack spacing={2} direction="column">
               <Button variant="contained" className="excel-button">
                  导出为Excel
               </Button>
               <Button variant="contained" className="pdf-button">
                  导出为PDF
               </Button>
            </Stack>
         </Stack>

         {/* Grid container with items */}
         <Grid container spacing={2}>
            {/* 1st row */}
            <Grid item xs={12} sx={{ margin: "20px 0" }}>
               <Stack direction="row" spacing={1} alignItems="center">
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
            </Grid>

            {/* 2nd row */}
            <Grid item xs={12} sx={{ margin: "20px 0" }}>
               <Stack direction="row" spacing={1} alignItems="center">
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
            </Grid>
         </Grid>
      </Stack>
   );
}
