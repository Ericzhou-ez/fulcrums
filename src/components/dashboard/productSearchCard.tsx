import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { X as XIcon, ArrowUpRight as ArrowUpRightIcon } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleCard } from "./simpleCard";
import data from "../../data/lookup_temp.json";

interface Product {
   id: string;
   productName: string;
   category: string;
   ownerName: string;
   storeName: string;
   price: number;
   phoneNumber: number;
}

interface ProductCardProps {
   product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";
   const [detailsOpen, setDetailsOpen] = useState(false);

   function toggleDetails() {
      setDetailsOpen((prev) => !prev);
      if (!detailsOpen) {
         document.body.style.overflow = "hidden"; // Prevent scrolling when overlay is open
      } else {
         document.body.style.overflow = "auto";
      }
   }

     const company =
        (data.search_by_company as Record<string, any>)[product.storeName] ??
        null;

     const moreProducts =
        company?.Products?.filter((p: any) => p !== product.productName) || [];

   return (
      <div style={{ position: "relative" }}>
         <Card
            sx={{
               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
               pt: 1,
               mt: 2,
               borderRadius: 4,
               backgroundColor: isDark ? "#3c3a42" : "#faf6f2",
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
                              variant="h3"
                              sx={{
                                 fontSize: { xs: "1.3rem", md: "1.8rem" },
                                 lineHeight: { xs: "1.9rem", md: "2.5rem" },
                              }}
                           >
                              {product.productName}
                           </Typography>
                           <IconButton
                              sx={{ marginLeft: "10px" }}
                              onClick={toggleDetails}
                           >
                              <ArrowUpRightIcon size={20} />
                           </IconButton>
                        </div>

                        <Typography
                           variant="body2"
                           color="text.secondary"
                           sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                        >
                           {product.storeName}
                        </Typography>
                     </Stack>
                  </Stack>
               </Stack>
            </CardContent>
         </Card>

         {detailsOpen && (
            <>
               <div className="overlay" onClick={toggleDetails}></div>

               <div className="product-details">
                  <div
                     style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                     }}
                  >
                     <Typography
                        variant="h5"
                        sx={{
                           color: isDark ? "#FFA500" : "#D35400",
                           fontSize: { xs: "1.5rem", md: "1.8rem" },
                           fontWeight: 600,
                           letterSpacing: "0.4px",
                           pb: 2,
                        }}
                     >
                        {product.productName}
                     </Typography>

                     <IconButton onClick={toggleDetails} className="x-icon">
                        <XIcon size={20} />
                     </IconButton>
                  </div>

                  <Typography sx={{ pb: 1 }}>
                     <strong>类别:</strong> {product.category}
                  </Typography>
                  <Typography sx={{ pb: 1 }}>
                     <strong>卖家:</strong> {product.ownerName}
                  </Typography>
                  <Typography sx={{ pb: 1 }}>
                     <strong>联系电话:</strong> {product.phoneNumber}
                  </Typography>

                  {moreProducts.length > 0 && (
                     <div className="more-products">
                        <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
                           更多来自{product.storeName}的产品
                        </Typography>
                        <SimpleCard products={moreProducts} isDark={isDark} />
                     </div>
                  )}
               </div>
            </>
         )}
      </div>
   );
}
