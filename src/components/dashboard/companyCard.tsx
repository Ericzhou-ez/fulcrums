import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Users as UsersIcon, Star as StarIcon } from "phosphor-react";
import { SimpleCard } from "./simpleCard";
import { Tooltip, useTheme } from "@mui/material";
import { X as XIcon } from "phosphor-react";

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
                        <Typography
                           color="text.primary"
                           variant="h3"
                           sx={{ fontSize: { xs: "1.5rem", md: "2.5rem" } }}
                        >
                           {company.name}
                        </Typography>
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
               <button className="more-btn" onClick={() => toggleDetails()}>
                  更多
               </button>
            </CardContent>
         </Card>

         {detailsOpen && (
            <div className="store-details">
               <XIcon className="x-icon" size={20} onClick={() => toggleDetails()} />
            </div>
         )}
         {detailsOpen && (
            <div className="overlay" onClick={() => toggleDetails()}></div>
         )}
      </div>
   );
}
