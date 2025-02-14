import React from "react";
import ProductCard from "./card";

interface CardItem {
   id: number;
   title: string;
   productId: string;
   postedTime: string;
   image: string;
}

const mockData: CardItem[] = [
   {
      id: 1,
      title: "财神蛇公仔毛绒玩具财神蛇公仔毛绒玩具",
      productId: "13355894839",
      postedTime: "5分钟前",
      image: "https://media.istockphoto.com/id/909772478/photo/brown-teddy-bear-isolated-in-front-of-a-white-background.jpg?s=612x612&w=0&k=20&c=F4252bOrMfRTB8kWm2oM2jlb9JXY08tKCaO5G_ms1Uw=",
   },
   {
      id: 2,
      title: "小红书老花镜架",
      productId: "13819925889",
      postedTime: "59分钟前",
      image: "https://www.nvisioncenters.com/wp-content/uploads//black-frame-glasses-close-up.jpg",
   },
   {
      id: 3,
      title: "示例商品3",
      productId: "13100000000",
      postedTime: "2小时前",
      image: "https://plushiedepot.com/cdn/shop/products/7033ad3817d7bbe408c5b57a3f65c19f.jpg?v=1724425679",
   },
   // {
   //    id: 4,
   //    title: "示例商品3",
   //    productId: "13100000000",
   //    postedTime: "2小时前",
   //    image: "https://plushiedepot.com/cdn/shop/products/7033ad3817d7bbe408c5b57a3f65c19f.jpg?v=1724425679",
   // },
];

export default function CardSlider() {
   return (
      <div className="card-slider">
         {mockData.map((item) => (
            <div className="card-slider-item" key={item.id}>
               <ProductCard item={item} />
            </div>
         ))}
      </div>
   );
}
