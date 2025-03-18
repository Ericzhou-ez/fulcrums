import React from "react";
import ProductCard from "./card";
import { ProductType } from "../../types/types";
import { ProductSupplierClientContextProvider } from "../../contexts/productSupplierClientContextProvider";

interface CardSliderProp {
   isDarkMode: boolean;
   isRecent: boolean;
   products: any;
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

   return (
      <div
         className={
            filteredProducts.length > 0
               ? "card-slider"
               : "cta-data-input"
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
