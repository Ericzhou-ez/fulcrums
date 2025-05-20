import { Product, Supplier, Clients } from "../types/types";

export function exportInternalProductCSV({
   products,
   suppliers,
   clients,
   upCharge,
}: {
   products: Record<string, Product>;
   suppliers: Record<string, Supplier>;
   clients: Record<string, Clients>;
   upCharge: number;
}) {
   if (!products || Object.keys(products).length === 0) return;

   const headerEn = [
      "B/C No.",
      "Ref No.",
      "DESIGNATION CN",
      "DESIGNATION EN",
      "Unit Price",
      "COL",
      "CTS CONTENEUR",
      "TTL Cartons",
      "Pack L",
      "Pack W",
      "Pack H",
      "Pack CBM",
      "TTL CBM",
      "Amount",
      "Gross Weight",
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
      "单价",
      "装箱量",
      "装柜箱数",
      "装柜总数",
      "长 (m)",
      "宽 (m)",
      "高 (m)",
      "单箱体积",
      "总体积",
      "总金额",
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

   const calcCBM = (
      l?: number,
      w?: number,
      h?: number,
      unit: "m" | "cm" | "L" | undefined = "m"
   ) => {
      if (l == null || w == null || h == null) return "";
      if (unit === "L") return (l / 1000).toFixed(3);
      const toM = (x: number) => (unit === "cm" ? x / 100 : x);
      return (toM(l) * toM(w) * toM(h)).toFixed(3);
   };

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

      return [
         "",
         "", // B/C No., Ref No.
         p.productChineseName ?? "",
         p.productEnglishName ?? "",
         `${p.unitPrice ?? ""}`,
         p.packing ?? "",
         "",
         "", // CTS CONTENEUR, TTL Cartons
         isNaN(Lm) ? "" : Lm.toFixed(2),
         isNaN(Wm) ? "" : Wm.toFixed(2),
         isNaN(Hm) ? "" : Hm.toFixed(2),
         oneBoxCBM,
         "",
         "", // Amount   (fill later)
         p.packingMass
            ? `${p.packingMass?.packingMassQuantity}${p.packingMass?.packingMassUnit}`
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
