import { Product, Supplier, Clients } from "../types/types";

export function exportInternalProductCSV({
   products,
   suppliers,
   clients,
   upCharge,
   exchangeRate,
   currency,
   pricePerContainer,
}: {
   products: Record<string, Product>;
   suppliers: Record<string, Supplier>;
   clients: Record<string, Clients>;
   upCharge: number;
   exchangeRate: number;
   currency: string;
   pricePerContainer: number;
}) {
   if (!products || Object.keys(products).length === 0) return;

   const headerEn = [
      "B/C No.",
      "Ref No.",
      "DESIGNATION CN",
      "DESIGNATION EN",
      "COL",
      "CTS CONTENEUR",
      "TTL Cartons",
      "Pack L",
      "Pack W",
      "Pack H",
      "Pack CBM",
      "TTL CBM",
      "Unit Price (¥)",
      `Unit Price (${currency})`,
      `Commission (${currency})`,
      `Freight Cost (${currency})`,
      `Amount (${currency})`,
      `Gross Weight`,
      "STOCK",
      "ETD",
      "Container No.",
      "Seal No.",
      "Client(s)",
      "Supplier",
      "Notes",
   ];

   const headerZh = [
      "订单号码",
      "货号",
      "品名",
      "品名(英)",
      "装箱量",
      "装柜箱数",
      "装柜总数",
      "长 (m)",
      "宽 (m)",
      "高 (m)",
      "单箱体积",
      "总体积",
      `单价 (¥)`,
      `单价 (${currency})`,
      `佣金 (${currency})`,
      `运费 (${currency})`,
      `总金额 (${currency})`,
      "毛重",
      "库存",
      "起航日期",
      "集装箱号",
      "封号",
      "客户",
      "供应商",
      "备注",
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

   const rows = Object.values(products).map((p) => {
      const cbm =
         p.packingVolume.packingUnit === "cm"
            ? (parseFloat(p.packingVolume.length) *
                 parseFloat(p.packingVolume.width) *
                 parseFloat(p.packingVolume.height)) /
              1_000_000
            : p.packingVolume.packingUnit === "m"
            ? parseFloat(p.packingVolume.length) *
              parseFloat(p.packingVolume.width) *
              parseFloat(p.packingVolume.height)
            : p.packingVolume.packingUnit === "L"
            ? (parseFloat(p.packingVolume.length) *
                 parseFloat(p.packingVolume.width) *
                 parseFloat(p.packingVolume.height)) /
              1_000
            : 0;

      const unitPV = p.packingVolume?.packingUnit as
         | "m"
         | "cm"
         | "L"
         | undefined;

      const Lm = toMeters(parseFloat(p.packingVolume?.length ?? ""), unitPV);
      const Wm = toMeters(parseFloat(p.packingVolume?.width ?? ""), unitPV);
      const Hm = toMeters(parseFloat(p.packingVolume?.height ?? ""), unitPV);

      const unitPriceLocal = parseFloat(p.unitPrice) / exchangeRate;
      const commission = (upCharge - 1) * unitPriceLocal;
      const oneBoxCbm = cbm / parseInt(p.packing);
      const freight = (pricePerContainer / 68) * oneBoxCbm;
      const salesPrice = unitPriceLocal + commission + freight;

      return [
         "",
         "", // B/C No., Ref No.
         p.productChineseName ?? "",
         p.productEnglishName ?? "",
         p.packing ?? "",
         "",
         "", // CTS CONTENEUR, TTL Cartons
         isNaN(Lm) ? "" : Lm.toFixed(2),
         isNaN(Wm) ? "" : Wm.toFixed(2),
         isNaN(Hm) ? "" : Hm.toFixed(2),
         oneBoxCbm.toFixed(2),
         "",
         parseFloat(p.unitPrice).toFixed(2),
         unitPriceLocal ? unitPriceLocal.toFixed(2) : "",
         commission.toFixed(2),
         freight.toFixed(2),
         salesPrice.toFixed(4),
         p.packingMass.packingMassQuantity
            ? `${parseFloat(p.packingMass?.packingMassQuantity).toFixed(3)}${
                 p.packingMass?.packingMassUnit
              }`
            : "",
         "",
         "",
         "",
         "",
         (p.clients ?? [])
            .map((id) => clients[id]?.companyName ?? "")
            .join("; "),
         suppliers[p.supplierId]?.supplierName ?? "",
         p.additionalNotes ?? "",
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
      download: `内部报价_${new Date().toISOString().slice(0, 10)}.csv`,
   });
   a.click();
   URL.revokeObjectURL(url);
}
