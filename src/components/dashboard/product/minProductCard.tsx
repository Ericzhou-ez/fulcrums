import React from "react";
import {
   Card,
   CardContent,
   Typography,
   IconButton,
   Tooltip,
} from "@mui/material";
import CancelLight from "../../../assets/icons/x-light.svg"
import CancelDark from "../../../assets/icons/x-dark.svg";
import HeartComponent from "./heart";
import { Product } from "../../../types/types";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import TimeAgoTypography from "./timeAgoTypography";

interface CardProps {
   item: Product;
   isDarkMode: boolean;
}

export default function ProductCard({ item, isDarkMode }: CardProps) {
   const deleteIcon = isDarkMode ? CancelDark : CancelLight;

   const { toggleSaveUnsaveProduct, deleteProducts, deletedProduct } = useProductSupplierClientContext();

   async function toggleSave(productId: string) {
      await toggleSaveUnsaveProduct(productId);
   }

   async function handleProductDeletion() {
      await deleteProducts([item.productId]);
      return;
   }

   return (
      <Card
         sx={{
            display: deletedProduct ? "none" : "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
         }}
      >
         <CardContent
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "flex-start",
            }}
            className="card-flex"
         >
            <div style={{ display: "flex", flexDirection: "column" }}>
               <a href={`/product/${item.productId}`}>
                  <Typography
                     variant="subtitle1"
                     gutterBottom
                     sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                     className="link"
                  >
                     {item.productChineseName}
                  </Typography>
               </a>
               <TimeAgoTypography timestamp={item.updatedAt} />
            </div>

            <div style={{ display: "flex", marginBottom: "4px" }}>
               <div onClick={() => toggleSave(item.productId)}>
                  <HeartComponent saved={item.saved} />
               </div>

               <Tooltip title="删除">
                  <IconButton
                     size="small"
                     onClick={() => handleProductDeletion()}
                  >
                     <img src={deleteIcon} alt="x" width="24" height="24" />
                  </IconButton>
               </Tooltip>
            </div>
         </CardContent>
      </Card>
   );
}
