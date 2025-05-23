import { Product } from "../types/types";

export function exportExternalProductCSV({
   products,
   upCharge,
   exchangeRate,
   currency,
   pricePerContainer,
}: {
   products: Record<string, Product>;
   upCharge: number;
   exchangeRate: number;
   currency: string;
   pricePerContainer: number;
}) {
   if (!products || Object.keys(products).length === 0) return;

   const headerEn = [
      "DESIGNATION CN",
      "DESIGNATION EN",
      "COL",
      "Pack L",
      "Pack W",
      "Pack H",
      "Pack CBM",
      `Unit Price (${currency})`,
      `Commission (${currency})`,
      `Freight Cost (${currency})`,
      `Total Price (${currency})`,
      "Gross Weight",
   ];

   const headerZh = [
      "品名",
      "品名(英)",
      "装箱量",
      "长 (m)",
      "宽 (m)",
      "高 (m)",
      "单箱体积",
      `单价 (${currency})`,
      `佣金 (${currency})`,
      `运费 (${currency})`,
      `总价 (${currency})`,
      "毛重",
   ];

   const csvEscape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

   const toMeters = (val: number, unit: string | undefined) => {
      if (isNaN(val)) return NaN;
      switch (unit) {
         case "cm":
            return val / 100;
         case "L":
            return val / 1000;
         default:
            return val; // already metres
      }
   };

   const cbm = (l?: number, w?: number, h?: number) =>
      l && w && h ? (l * w * h).toFixed(3) : "";

   const rows = Object.values(products).map((p) => {
      const unitPV = p.packingVolume?.packingUnit as
         | "m"
         | "cm"
         | "L"
         | undefined;

      const Lm = toMeters(parseFloat(p.packingVolume?.length ?? ""), unitPV);
      const Wm = toMeters(parseFloat(p.packingVolume?.width ?? ""), unitPV);
      const Hm = toMeters(parseFloat(p.packingVolume?.height ?? ""), unitPV);

      const oneBoxCBM = cbm(Lm, Wm, Hm);

      const unitPrice = parseFloat(p.unitPrice ?? "0") / exchangeRate;
      const commission = unitPrice ? (upCharge - 1) * unitPrice : 0;
      const freightCost =
         oneBoxCBM && p.packing
            ? (pricePerContainer / 68) *
              (parseFloat(oneBoxCBM) / parseInt(p.packing))
            : 0;
      const totalPrice = unitPrice + commission + freightCost;

      return [
         p.productChineseName ?? "",
         p.productEnglishName ?? "",
         p.packing ?? "",
         isNaN(Lm) ? "" : Lm.toFixed(2),
         isNaN(Wm) ? "" : Wm.toFixed(2),
         isNaN(Hm) ? "" : Hm.toFixed(2),
         oneBoxCBM,
         unitPrice ? unitPrice.toFixed(2) : "",
         commission ? commission.toFixed(2) : "",
         freightCost ? freightCost.toFixed(2) : "",
         totalPrice ? totalPrice.toFixed(2) : "",
         p.packingMass
            ? `${parseFloat(p.packingMass?.packingMassQuantity).toFixed(3)}${
                 p.packingMass?.packingMassUnit
              }`
            : "",
      ];
   });

   const csv =
      "\uFEFF" +
      [headerEn, headerZh, ...rows]
         .map((r) => r.map(csvEscape).join(","))
         .join("\n");

   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
   const url = URL.createObjectURL(blob);
   const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `外部报价_${new Date().toISOString().slice(0, 10)}.csv`,
   });
   a.click();
   URL.revokeObjectURL(url);
}
