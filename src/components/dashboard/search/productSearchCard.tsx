import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { X as XIcon, ArrowUpRight as ArrowUpRightIcon } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import data from "../../../data/products_companies.json";

interface Product {
   id: string;
   productName: string;
   category: string[];
   ownerName: string;
   storeName: string;
   phoneNumber: number;
   link: string;
}

interface ProductCardProps {
   product: Product;
}

const products: any = data.search_by_product;

export function ProductCard({ product }: ProductCardProps) {
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";
   const [detailsOpen, setDetailsOpen] = useState(false);

   function toggleDetails() {
      setDetailsOpen((prev) => !prev);
   }

   const company =
      (data.search_by_store as Record<string, any>)[product.storeName] ?? null;

   const moreProducts =
      company?.Products?.map((p: string) => ({
         name: p,
         link: products[p]?.Link || "#",
      })) || [];

   return (
      <div style={{ position: "relative" }}>
         {/* Product Card */}
         <Card
            sx={{
               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
               pt: 1,
               mt: 2,
               borderRadius: 4,
               backgroundColor: isDark ? "#1e1d1b" : "#faf6f2",
            }}
         >
            <CardContent>
               <Stack spacing={1.5}>
                  <Stack direction="row" spacing={2}>
                     <Stack spacing={0.5}>
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
                                 fontSize: { xs: "1.3rem", md: "1.6rem" },
                                 lineHeight: { xs: "1.9rem", md: "2.5rem" },
                                 whiteSpace: "nowrap",
                                 overflow: "hidden",
                                 maxWidth: {
                                    xs: "200px",
                                    sm: "400px",
                                    md: "600px",
                                    lg: "900px",
                                 },
                                 textOverflow: "ellipsis",
                              }}
                           >
                              {product.productName}
                           </Typography>
                           <IconButton onClick={toggleDetails}>
                              <ArrowUpRightIcon size={20} />
                           </IconButton>
                        </div>

                        <Typography
                           variant="body2"
                           color="text.secondary"
                           sx={{ fontSize: { xs: "0.7rem", md: "0.9rem" } }}
                        >
                           {product.storeName}
                        </Typography>
                     </Stack>
                  </Stack>
               </Stack>
            </CardContent>
         </Card>

         {/* Product Details Overlay */}
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
                     <a
                        href={product.link}
                        rel="noopener noreferrer"
                        target="_blank"
                     >
                        <Typography
                           variant="h5"
                           sx={{
                              color: isDark ? "#FFA500" : "#D35400",
                              fontSize: { xs: "1.8rem", md: "2rem" },
                              fontWeight: 600,
                              letterSpacing: "0.4px",
                              pb: 2,
                              pt: { xs: 0, sm: 3 },
                              textDecoration: "underline",
                              cursor: "pointer",
                           }}
                        >
                           {product.productName}
                        </Typography>
                     </a>

                     <IconButton onClick={toggleDetails} className="x-icon">
                        <XIcon size={20} />
                     </IconButton>
                  </div>

                  <Typography sx={{ pb: 0.5 }}>
                     <strong>类别:</strong> {product.category.join(", ")}
                  </Typography>
                  <Typography sx={{ pb: 0.5 }}>
                     <strong>卖家:</strong> {product.ownerName}
                  </Typography>
                  <Typography sx={{ pb: 0.5 }}>
                     <strong>联系电话:</strong> {product.phoneNumber}
                  </Typography>

                  {moreProducts.length > 0 && (
                     <div className="more-products">
                        <Typography variant="h6" sx={{ mt: 3, mb: 1.5 }}>
                           更多来自{product.storeName}的产品
                        </Typography>
                        <div
                           style={{
                              display: "flex",
                              flexDirection: "column",
                              borderRadius: "20px",
                              overflow: "hidden",
                              textAlign: "center",
                              border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                           }}
                        >
                           {moreProducts.map((p: any, index: any) => (
                              <div
                                 key={p.name}
                                 style={{
                                    padding: "10px",
                                    borderBottom:
                                       index !== moreProducts.length - 1
                                          ? `0.5px solid ${
                                               isDark ? "#444" : "#ddd"
                                            }`
                                          : "none",
                                 }}
                              >
                                 <a
                                    href={p.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                       textDecoration: "underline",
                                       cursor: "pointer",
                                       color: isDark ? "#FFA500" : "#D35400",
                                       fontSize: "0.95rem",
                                       fontWeight: 500,
                                    }}
                                 >
                                    {p.name}
                                 </a>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </>
         )}
      </div>
   );
}
