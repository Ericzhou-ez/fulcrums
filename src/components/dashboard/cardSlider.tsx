import React from "react";
import ProductCard from "./card";

interface CardItem {
   id: number;
   title: string;
   productId: string;
   postedTime: string;
   image: string;
}

interface CardSliderProp {
   isDarkMode: boolean;
   isRecent: boolean;
   products: any;
}

const CardSlider: React.FC<CardSliderProp> = ({ isDarkMode, isRecent, products }) => {

   return (
      <div className={Object.keys(products).length > 0 ? "card-slider" : "cta-data-input"}>
         {products ? (
            Object.entries(products).map(([id, product]: any) => (
               <div className="card-slider-item" key={id}>
                  <ProductCard item={product} isDarkMode={isDarkMode} />
               </div>
            ))
         ) : isRecent ? (
            <p>「上传内容即可开始」</p>
         ) : (
            <p>「保存项目以在此处查看」</p>
         )}
      </div>
   );
};

export default CardSlider;
