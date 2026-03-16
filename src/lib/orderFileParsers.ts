import { PDFDocument } from "pdf-lib";
import type { OrderProductLineItem } from "../types/types";

/**
 * Parse CSV in client export format: headers include "ID" (productId) and
 * "Quantity (Units)" or "数量". Rows with empty/0 quantity are skipped.
 * Supports BOM and double header row (EN + ZH) from ClientProductCsvBuilder.
 */
export function parseOrderCsv(
   csvText: string,
   validProductIds?: Set<string>,
): OrderProductLineItem[] {
   const normalized = csvText.replace(/^\uFEFF/, "").trim();
   const lines = normalized.split(/\r?\n/).filter((line) => line.trim());
   if (lines.length < 2) return [];

   const parseRow = (row: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
         const ch = row[i];
         if (ch === '"') {
            inQuotes = !inQuotes;
         } else if ((ch === "," && !inQuotes) || ch === "\t") {
            result.push(current.replace(/^"|"$/g, "").replace(/""/g, '"'));
            current = "";
         } else {
            current += ch;
         }
      }
      result.push(current.replace(/^"|"$/g, "").replace(/""/g, '"'));
      return result;
   };

   // Export has two header rows (EN then ZH); either can define columns
   const findHeaderIndices = (row: string[]) => {
      const idCol = row.findIndex(
         (h) =>
            h
               .replace(/\uFEFF/g, "")
               .trim()
               .toLowerCase() === "id",
      );
      const qtyCol = row.findIndex(
         (h) =>
            h.includes("Quantity") ||
            h.includes("数量") ||
            h.trim().toLowerCase() === "quantity (units)",
      );
      return { idCol, qtyCol };
   };

   const row0 = parseRow(lines[0]);
   let { idCol, qtyCol } = findHeaderIndices(row0);
   if (idCol === -1 || qtyCol === -1) {
      const row1 = lines.length > 1 ? parseRow(lines[1]) : [];
      ({ idCol, qtyCol } = findHeaderIndices(row1));
   }
   if (idCol === -1 || qtyCol === -1) return [];

   const items: OrderProductLineItem[] = [];
   for (let i = 1; i < lines.length; i++) {
      const cells = parseRow(lines[i]);
      const productId = (cells[idCol] ?? "").trim().replace(/\uFEFF/g, "");
      const qtyRaw = (cells[qtyCol] ?? "").trim().replace(/,/g, "");
      const quantity = parseInt(qtyRaw, 10);
      if (!productId || isNaN(quantity) || quantity <= 0) continue;
      if (validProductIds && !validProductIds.has(productId)) continue;
      items.push({ productId, quantity });
   }
   return items;
}

/**
 * Parse PDF in external quotation format: form fields quantity_0, quantity_1, ...
 * Map index i to productIds[i] (client's product list order). 0 or empty = skip.
 */
export async function parseOrderPdf(
   pdfArrayBuffer: ArrayBuffer,
   productIdsInOrder: string[],
): Promise<OrderProductLineItem[]> {
   const doc = await PDFDocument.load(pdfArrayBuffer, {
      ignoreEncryption: true,
   });
   let form;
   try {
      form = doc.getForm();
   } catch {
      throw new Error(
         "PDF 中未找到可填写的数量栏位，请确认为从此应用导出的报价 PDF（含数量输入框）",
      );
   }
   const items: OrderProductLineItem[] = [];

   for (let i = 0; i < productIdsInOrder.length; i++) {
      const fieldName = `quantity_${i}`;
      try {
         const field = form.getTextField(fieldName);
         const text = (field.getText() ?? "").trim();
         const quantity = parseInt(text, 10);
         if (!text || isNaN(quantity) || quantity <= 0) continue;
         items.push({ productId: productIdsInOrder[i], quantity });
      } catch {
         // field may not exist for this index
      }
   }
   return items;
}
