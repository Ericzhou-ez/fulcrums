import React from "react";
import {
   Box,
   Card,
   CardMedia,
   CardContent,
   Typography,
   Stack,
   IconButton,
} from "@mui/material";

interface CardItem {
   id: number;
   title: string;
   productId: string;
   postedTime: string;
   image: string;
}

interface CardProps {
   item: CardItem;
}

export default function ProductCard({ item }: CardProps) {
   return (
      <Card
         sx={{
            width: 230,
            borderRadius: 5,
            boxShadow: 1,
            overflow: "hidden",
            WebkitBoxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
         }}
      >
         <CardMedia
            component="img"
            image={item.image}
            alt={item.title}
            className="product-image"
            sx={{
               width: "100%",
               height: 130,
               objectFit: "cover",
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
               {item.title}
            </Typography>

            <Box
               sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}
            >
               <Typography variant="caption" color="text.secondary">
                  {item.postedTime}
               </Typography>

               <Stack direction="row" spacing={1}>
                  <IconButton size="small">
                     <img src="../assets/icons/edit-dark.svg" alt="o" />
                  </IconButton>
                  <IconButton size="small">
                     <img src="../assets/icons/heart-light.svg" alt="o" />
                  </IconButton>
               </Stack>
            </Box>
         </CardContent>
      </Card>
   );
}
