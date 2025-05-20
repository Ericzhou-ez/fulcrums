import React from "react";
import ProductCard from "./card";
import { Product } from "../../../types/types";
import {
   ProductSupplierClientContextProvider,
   useProductSupplierClientContext,
} from "../../../contexts/productSupplierClientContextProvider";
import { Stack, Typography } from "@mui/material";
import Loader from "../../core/loader";

interface CardSliderProp {
   isDarkMode: boolean;
   isRecent: boolean;
   products: { [key: string]: Product };
}

const CardSlider: React.FC<CardSliderProp> = ({
   isDarkMode,
   isRecent,
   products,
}) => {
   const filteredProducts = Object.entries(products)
      .filter(([id, product]: [string, any]) => isRecent || product.saved)
      .sort(
         ([, a]: [string, any], [, b]: [string, any]) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

   return (
      <div
         className={
            filteredProducts.length > 0 ? "card-slider" : "cta-data-input"
         }
      >
         {filteredProducts.length > 0 ? (
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
