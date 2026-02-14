import { Product } from "../../../types/types";

const now = new Date().toISOString();
const baseProduct: Omit<Product, "productId" | "productChineseName" | "productEnglishName" | "unitPrice" | "supplierId"> = {
   image: "",
   unitMass: { unitMassQuantity: "1", unitMassUnit: "kg" },
   material: "不锈钢",
   hsCode: "73239300",
   packing: "100",
   packingVolume: { length: "0.5", width: "0.3", height: "0.2", packingUnit: "m" },
   packingMass: { packingMassQuantity: "8", packingMassUnit: "kg" },
   saved: false,
   updatedAt: now,
   additionalNotes: "",
   clients: [],
   currency: "¥",
};

export const MOCK_PRODUCTS: Product[] = [
   {
      ...baseProduct,
      productId: "demo-1",
      productChineseName: "不锈钢保温杯",
      productEnglishName: "Stainless Steel Thermos",
      unitPrice: "45.00",
      supplierId: "sup-1",
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
   },
   {
      ...baseProduct,
      productId: "demo-2",
      productChineseName: "陶瓷马克杯",
      productEnglishName: "Ceramic Mug",
      unitPrice: "28.50",
      supplierId: "sup-1",
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
   },
   {
      ...baseProduct,
      productId: "demo-3",
      productChineseName: "玻璃储物罐",
      productEnglishName: "Glass Storage Jar",
      unitPrice: "62.00",
      supplierId: "sup-2",
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
   },
];
