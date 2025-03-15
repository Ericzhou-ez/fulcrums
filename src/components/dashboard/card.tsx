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
import EditLight from "../../assets/icons/edit-light.svg";
import EditDark from "../../assets/icons/edit-dark.svg";
import HeartLight from "../../assets/icons/heart-light.svg";
import HeartDark from "../../assets/icons/heart-dark.svg";

interface CardItem {
   id: number;
   title: string;
   productId: string;
   postedTime: string;
   image: string;
}

interface CardProps {
   item: CardItem;
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
            alt={item.title}
            className="product-image"
            sx={{
               width: "100%",
               height: 130,
               objectFit: "cover",
               boxShadow: "none",
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

            <div
               style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}
            >
               <Typography variant="caption" color="text.secondary">
                  {item.postedTime}
               </Typography>

               <Stack direction="row">
                  <Tooltip title="收藏">
                     <IconButton size="small">
                        {isDarkMode ? (
                           <img
                              src={HeartDark}
                              alt="o"
                              className="product-icons"
                           />
                        ) : (
                           <img
                              src={HeartLight}
                              alt="|"
                              className="product-icons"
                           />
                        )}
                     </IconButton>
                  </Tooltip>
               </Stack>
            </div>
         </CardContent>
      </Card>
   );
}
