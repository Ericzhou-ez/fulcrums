import {
   PDFDocument,
   StandardFonts,
   rgb,
   PDFImage,
   PDFEmbeddedPage,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Product, ProductType } from "../types/types";
import { wrapText, hasChinese } from "./helpers";

export async function ExternalPDFBuilder({
   products,
}: {
   products: Record<string, ProductType>;
}): Promise<void> {
   if (Object.keys(products).length === 0) return; 

   const pdfDoc = await PDFDocument.create();
   pdfDoc.registerFontkit(fontkit);
   const latin = await pdfDoc.embedFont(StandardFonts.Helvetica);
   const noto = await pdfDoc.embedFont(
      await fetch("/fonts/NotoSansSC-Regular.ttf").then((r) => r.arrayBuffer())
   );

   const pageW = 750,
      pageH = 550,
      margin = 5;
   const gridCols = 4,
      gridRows = 2;
   const cellW = (pageW - margin * (gridCols + 1)) / gridCols;
   const cellH = (pageH - margin * (gridRows + 1)) / gridRows;
   const imgMaxH = 60;
   const sizeCN = 8,
      sizeEN = 13,
      sizeRow = 9,
      lead = 2;

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
               x: x0 + 6 + 0.3,
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

      const rows: [string, string][] = [
         ["UnitPrice:", `${p.currency ?? ""}${p.unitPrice ?? ""}`],
         ["UnitMass:", `${p.mass?.quantity ?? ""}${p.mass?.unit ?? ""}`],
         ["Packing:", String(p.packaging ?? "")],
         [
            "PackingMass:",
            `${p.packingMass?.packingMass ?? ""}${
               p.packingMass?.packingMassUnit ?? ""
            }`,
         ],
         [
            "Volume:",
            `${p.packingVolume?.volume ?? ""}${p.packingVolume?.unit ?? ""}`,
         ],
      ];

      for (const [lab, val] of rows) {
         if (yCur < y0 + 10) break;
         yCur = drawDataRow(lab, val, x0 + 6, yCur, cellW - 12) - lead;
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
