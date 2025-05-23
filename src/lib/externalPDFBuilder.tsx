import { PDFDocument, StandardFonts, rgb, PDFImage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Product } from "../types/types";
import { wrapText, hasChinese } from "./helpers";

export async function ExternalPDFBuilder({
   products,
   upCharge,
   conversionRate,
   currency,
   pricePerContainer,
}: {
   products: Record<string, Product>;
   upCharge: number;
   conversionRate: number;
   currency: string;
   pricePerContainer: number;
}): Promise<void> {
   if (Object.keys(products).length === 0) return;

   const pdfDoc = await PDFDocument.create();
   pdfDoc.registerFontkit(fontkit);
   const latin = await pdfDoc.embedFont(StandardFonts.Helvetica);
   const noto = await pdfDoc.embedFont(
      await fetch("/fonts/NotoSansSC-Regular.ttf").then((r) => r.arrayBuffer())
   );

   const pageW = 750,
      pageH = 550, // standard
      margin = 5;
   const gridCols = 4,
      gridRows = 2;
   const cellW = (pageW - margin * (gridCols + 1)) / gridCols;
   const cellH = (pageH - margin * (gridRows + 1)) / gridRows;
   const imgMaxH = 100;
   const sizeCN = 8,
      sizePrice = 15,
      sizeEN = 12,
      sizeRow = 7,
      lead = 1;

   let page = pdfDoc.addPage([pageW, pageH]);

   const drawDataRow = (
      lab: string,
      val: string,
      x: number,
      y: number,
      maxW: number
   ): number => {
      page.drawText(lab, { x, y, size: sizeRow, font: latin });
      const valX = x + latin.widthOfTextAtSize(lab, sizeRow) + 4;
      const avail = maxW - (valX - x);
      const font = hasChinese(val) ? noto : latin;
      const lines = wrapText(val, font, sizeRow, avail);

      let cy = y;
      lines.forEach((ln, i) => {
         page.drawText(ln, {
            x: i ? x + 10 : valX,
            y: cy,
            size: sizeRow,
            font,
         });
         cy -= sizeRow + lead;
      });
      return cy;
   };

   const productList = Object.values(products);
   for (let i = 0; i < productList.length; i++) {
      if (i && i % (gridCols * gridRows) === 0)
         page = pdfDoc.addPage([pageW, pageH]);

      const col = i % gridCols;
      const row = Math.floor((i % (gridCols * gridRows)) / gridCols);
      const x0 = margin + col * (cellW + margin);
      const y0 = pageH - margin - row * (cellH + margin) - cellH;

      page.drawRectangle({
         x: x0,
         y: y0,
         width: cellW,
         height: cellH,
         borderColor: rgb(0.8, 0.8, 0.8),
         borderWidth: 0.5,
      });

      /* image */
      let yCur = y0 + cellH;
      const url = productList[i].image;
      const imgCache = new Map<string, PDFImage>();

      if (url) {
         try {
            if (!imgCache.has(url)) {
               const buf = await fetch(url).then((r) => r.arrayBuffer());
               const jpg = await pdfDoc.embedJpg(buf);
               imgCache.set(url, jpg);
            }
            const jpg = imgCache.get(url)!;
            const s = Math.min(cellW / jpg.width, imgMaxH / jpg.height);
            const { width: w, height: h } = jpg.scale(s);

            page.drawImage(jpg, {
               x: x0 + (cellW - w) / 2,
               y: yCur - h,
               width: w,
               height: h,
            });
            yCur -= h + 14;
         } catch (err) {
            console.error("We Love CROSS-ORIGIN", err);
         }
      }

      const p = productList[i];

      wrapText(p.productEnglishName, latin, sizeEN, cellW - 12).forEach(
         (ln) => {
            page.drawText(ln, {
               x: x0 + 6 + 0.4,
               y: yCur,
               size: sizeEN,
               font: latin,
            });
            yCur -= sizeEN + lead;
         }
      );

      wrapText(p.productChineseName, noto, sizeCN, cellW - 12).forEach((ln) => {
         page.drawText(ln, {
            x: x0 + 6,
            y: yCur,
            size: sizeCN,
            font: noto,
         });
         yCur -= sizeCN + lead;
      });

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

      const freight = ((pricePerContainer / 68) * cbm) / parseInt(p.packing);

      const adjustedPrice = (
         (parseFloat(p.unitPrice) * upCharge) / conversionRate +
         freight
      ).toFixed(2);

      yCur -= 9;

      wrapText(
         `${currency}${parseFloat(adjustedPrice).toFixed(2)}`,
         noto,
         sizePrice,
         cellW - 12
      ).forEach((ln) => {
         page.drawText(ln, {
            x: x0 + 6 + 0.8,
            y: yCur,
            size: sizePrice,
            font: noto,
            color: rgb(1, 0.4, 0),
         });
         yCur -= sizePrice + lead;
      });

      yCur -= 5;

      const rows: string[][] = [
         ...(p.unitMass?.unitMassQuantity
            ? [
                 [
                    "Unit Mass: ",
                    `${p.unitMass.unitMassQuantity}${
                       p.unitMass.unitMassUnit ?? ""
                    }`,
                 ],
              ]
            : []),

         ["Material:", `${p.material ?? ""}`],

         ["Packing:", p.packing ?? ""],

         ...(p.packingMass?.packingMassQuantity
            ? [
                 [
                    "Packing Mass:",
                    `${p.packingMass.packingMassQuantity}${
                       p.packingMass.packingMassUnit ?? ""
                    }`,
                 ],
              ]
            : []),

         ...(p.packingVolume?.length &&
         p.packingVolume?.width &&
         p.packingVolume?.height
            ? [
                 [
                    "Packing Volume:",
                    `L: ${parseFloat(p.packingVolume.length).toFixed(2)}${
                       p.packingVolume.packingUnit ?? ""
                    }   W: ${parseFloat(p.packingVolume.width).toFixed(2)}${
                       p.packingVolume.packingUnit ?? ""
                    }   H: ${parseFloat(p.packingVolume.height).toFixed(2)}${
                       p.packingVolume.packingUnit ?? ""
                    }`,
                 ],
              ]
            : []),
      ].filter(
         ([, value]) =>
            value !== undefined && value !== null && String(value).trim() !== ""
      );

      for (const [lab, val] of rows) {
         if (yCur < y0 + 10) break;
         yCur = drawDataRow(lab, val, x0 + 6, yCur, cellW - 12) - lead;
      }

      if (yCur > y0 + 20) {
         const label = "Quantity:";
         const labelX = x0 + 6;
         const labelY = y0 + 14;
         const inputX = labelX + latin.widthOfTextAtSize(label, sizeRow) + 6;
         const inputY = labelY - 2;
         const inputW = 70;
         const inputH = 12;

         page.drawText(label, {
            x: labelX,
            y: labelY,
            size: sizeRow,
            font: latin,
         });

         const form = pdfDoc.getForm();
         const fieldName = `quantity_${i}`;
         const field = form.createTextField(fieldName);

         field.setText("");
         field.addToPage(page, {
            x: inputX,
            y: inputY,
            width: inputW,
            height: inputH,
            borderColor: rgb(0.5, 0.5, 0.5),
            borderWidth: 0.3,
         });
      }
   }

   const dateStr = new Date().toISOString().split("T")[0];
   const blob = new Blob([await pdfDoc.save()], { type: "application/pdf" });
   const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `报价_${dateStr}.pdf`,
   });
   a.click();
}
