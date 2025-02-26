import React from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface SimpleCardProps {
   products: string[];
   isDark: boolean;
}

export function SimpleCard({ products = [], isDark }: SimpleCardProps) {
   return (
      <Card
         variant="outlined"
         sx={{
            borderRadius: "12px",
            backgroundColor: isDark ? "#595655" : "#e8e4e1",
         }}
      >
         <Stack divider={<Divider />}>
            {products.map((product, idx) => (
               <Stack
                  direction="row"
                  key={idx}
                  sx={{
                     alignItems: "center",
                     justifyContent: "space-between",
                     px: 2,
                     py: 1.5,
                  }}
               >
                  <Typography variant="subtitle1">{product}</Typography>
               </Stack>
            ))}
         </Stack>
      </Card>
   );
}
