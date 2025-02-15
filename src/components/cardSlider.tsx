import React from "react";
import ProductCard from "./card";

interface CardItem {
   id: number;
   title: string;
   productId: string;
   postedTime: string;
   image: string;
}

let mockData: CardItem[] = [
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
      id: 7,
      title: "辉柏宝迪得力开学季学生臻顺滑黑色墨办公按动中性笔",
      productId: "13100000000",
      postedTime: "1天前",
      image: "/public/demo/O1CN01wJdhhX1j3qOh8kjX9_!!2208589604493.avif",
   },
   {
      id: 8,
      title: "日韩轻奢钛钢项链女小众设计感热销吊坠2023新款锁骨链一件代发",
      productId: "13100000000",
      postedTime: "2天前",
      image: "/public/demo/IMG_8431.jpg",
   },
   {
      id: 9,
      title: "吉他批发38寸民谣木吉他初学41寸练习琴普及 Guitar跨境乐器工厂",
      productId: "13100000000",
      postedTime: "2天前",
      image: "/public/demo/O1CN01hS9YWP1Mul8RJHN3b_!!4001871495-0-cib.220x220.jpg",
   },
   {
      id: 10,
      title: "夏威夷系列草裙水豚卡皮巴拉玩偶公仔毛绒玩具抱枕生日礼物",
      productId: "13100000000",
      postedTime: "3天前",
      image: "/public/demo/images.jpg",
   },
   {
      id: 11,
      title: "郁金香小兔子发夹ins甜美少女心BB夹可爱学生鸭嘴夹头饰卡通发饰",
      productId: "13100000000",
      postedTime: "3天前",
      image: "/public/demo/images-1.jpg",
   },
   {
      id: 12,
      title: "跨境立体数字大盘直播蓝光玻璃石英硅胶手表",
      productId: "13100000000",
      postedTime: "4天前",
      image: "/public/demo/O1CN01pln4jM203FPjV7zaX_!!2214227246793-0-cib.220x220.jpg",
   },
];


interface CardSliderProp {
   isDarkMode: boolean;
   isRecent: boolean;
}

const CardSlider: React.FC<CardSliderProp> = ({ isDarkMode, isRecent }) => {
   const dataToShow = isRecent ? mockData : false;

   return (
      <div className={dataToShow ? "card-slider" : "cta-data-input"}>
         {dataToShow ? (
            dataToShow.map((item) => (
               <div className="card-slider-item" key={item.id}>
                  <ProductCard item={item} isDarkMode={isDarkMode} />
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
