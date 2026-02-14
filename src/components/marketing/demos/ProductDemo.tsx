import React from "react";
import MacOSDemoWindow from "../MacOSDemoWindow";
import ProductTablePreview from "./ProductTablePreview";
import { MOCK_PRODUCTS } from "./mockDemoData";

export default function ProductDemo() {
   return (
      <MacOSDemoWindow>
         <ProductTablePreview productList={MOCK_PRODUCTS} />
      </MacOSDemoWindow>
   );
}
