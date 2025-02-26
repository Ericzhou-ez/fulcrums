import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Users as UsersIcon, Star as StarIcon, ArrowUpRight } from "phosphor-react";
import { SimpleCard } from "./simpleCard";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { X as XIcon } from "phosphor-react";
import { ArrowUpRight as ArrowUpRightIcon } from "phosphor-react";

interface Company {
   id: string;
   name: string;
   ownerName: string;
   phoneNumber: number;
   address: string;
   category: string;
   products: string[];
}

interface CompanyCardProps {
   company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";
   const [detailsOpen, setDetailsOpen] = useState(false);

   function toggleDetails() {
      setDetailsOpen(!detailsOpen);
   }

   return (
      <div style={{ position: "relative" }}>
         <Card
            sx={{
               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
               pt: 1,
               mt: 2,
               borderRadius: 4,
               backgroundColor: isDark ? "#3c3a42" : "#faf6f2",
               overflow: detailsOpen ? "hidden" : "auto",
               pointerEvents: detailsOpen ? "none" : "all",
            }}
         >
            <CardContent>
               <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                     <Stack spacing={1}>
                        <div
                           style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                           }}
                        >
                           <Typography
                              color="text.primary"
                              variant="h3"
                              sx={{ fontSize: { xs: "1.7rem", md: "2.5rem" } }}
                           >
                              {company.name}
                           </Typography>
                           <IconButton
                              sx={{ marginLeft: "10px" }}
                              onClick={() => toggleDetails()}
                           >
                              <ArrowUpRightIcon size={20} />
                           </IconButton>
                        </div>

                        <Typography
                           variant="body2"
                           color="text.seondary"
                           sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                        >
                           {company.category}
                        </Typography>
                     </Stack>
                  </Stack>
                  {company.products && (
                     <SimpleCard products={company.products} isDark={isDark} />
                  )}
               </Stack>
            </CardContent>
         </Card>

         {detailsOpen && (
            <>
               <div className="overlay" onClick={() => toggleDetails()}></div>

               <div className="store-details">
                  <h2>{company.name}</h2>
                  <p>{company.address}</p>

                  <XIcon
                     className="x-icon"
                     size={20}
                     onClick={() => toggleDetails()}
                  />
               </div>
            </>
         )}
      </div>
   );
}
