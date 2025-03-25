import React from "react";
import ProductCard from "./card";
import { Product, ProductType } from "../../types/types";
import {
   ProductSupplierClientContextProvider,
   useProductSupplierClientContext,
} from "../../contexts/productSupplierClientContextProvider";
import { Stack, Typography } from "@mui/material";
import Loader from "../core/loader";

interface CardSliderProp {
   isDarkMode: boolean;
   isRecent: boolean;
   products: Product;
}

const CardSlider: React.FC<CardSliderProp> = ({
   isDarkMode,
   isRecent,
   products,
}) => {
   const filteredProducts = isRecent
      ? Object.entries(products)
      : Object.entries(products).filter(
           ([id, product]: [string, any]) => product.saved
        );
   const { productLoading } = useProductSupplierClientContext();

   return (
      <div
         className={
            filteredProducts.length > 0 ? "card-slider" : "cta-data-input"
         }
      >
         {productLoading ? (
            <Stack
               direction="row"
               gap={1.5}
               justifyContent="center"
               alignItems="center"
            >
               <Typography variant="body2" textAlign="center">
                  拼命加载中...
               </Typography>
               <Loader />
            </Stack>
         ) : filteredProducts.length > 0 ? (
            filteredProducts.map(([id, product]: any) => (
               <div className="card-slider-item" key={id}>
                  <ProductCard item={product} isDarkMode={isDarkMode} />
               </div>
            ))
         ) : isRecent ? (
            <a href="/dashboard/add-product">
               <p>「上传内容即可查看&#8599;」</p>
            </a>
         ) : (
            <p>「保存项目以在此处查看」</p>
         )}
      </div>
   );
};

export default CardSlider;
