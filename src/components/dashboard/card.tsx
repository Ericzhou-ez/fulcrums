import React from "react";
import {
   Box,
   Card,
   CardMedia,
   CardContent,
   Typography,
   Stack,
   IconButton,
   Tooltip,
} from "@mui/material";
import HeartComponent from "./heart";
import { ProductType } from "../../types/types";

interface CardProps {
   item: ProductType;
   isDarkMode: boolean;
}

export default function ProductCard({ item, isDarkMode }: CardProps) {
   return (
      <Card
         sx={{
            width: {
               xs: "230px",
               md: "270px",
            },
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
            WebkitBoxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.28s ease",
            "&:hover": {
               boxShadow: "0 5px 9px rgba(0, 0, 0, 0.12)",
               WebkitBoxShadow: "0 5px 9px rgba(0, 0, 0, 0.12)",
               transform: "scale(1.01)",
            },
         }}
      >
         <CardMedia
            component="img"
            image={item.image}
            alt={item.name}
            className="product-image"
            sx={{
               width: "100%",
               height: 150,
               backgroundPosition: "center",
               objectFit: "cover",
               boxShadow: "none",
               borderBottomLeftRadius: 0,
               borderBottomRightRadius: 0,
            }}
         />

         <CardContent
            sx={{
               p: 2,
               display: "flex",
               flexDirection: "column",
            }}
         >
            <Typography variant="h6" gutterBottom noWrap>
               {item.name}
            </Typography>

            <div
               style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}
            >
               <Typography variant="caption" color="text.secondary">
                  {item.updatedAt}
               </Typography>

               <Stack direction="row">
                  <Tooltip title="收藏">
                     <HeartComponent saved={item.saved} />
                  </Tooltip>
               </Stack>
            </div>
         </CardContent>
      </Card>
   );
}
