import { Clients } from "../types/types";

/**
 * Detect if a string contains at least one CJK character.
 * Always coerce "" if nullish
 */
export function hasChinese(text: string | undefined | null): boolean {
   const safe = text ?? "";
   return /[\u3400-\u9FFF]/.test(safe);
}

export function wrapText(
   text: string,
   font: any,
   size: number,
   maxWidth: number,
) {
   const safe = text ?? "";
   const wordMode = !hasChinese(safe);
   const parts = wordMode ? safe.split(/\s+/) : [...safe];
   const lines: string[] = [];
   let line = "";

   parts.forEach((p, idx) => {
      const test = wordMode ? (line ? `${line} ${p}` : p) : line + p;
      if (font.widthOfTextAtSize(test, size) <= maxWidth) {
         line = test;
      } else {
         if (line) lines.push(line);
         line = p;
      }
      if (idx === parts.length - 1 && line) lines.push(line);
   });
   return lines;
}

/**
 * Wrap text into at most maxLines by reducing font size. Returns the lines to draw and the size to use.
 * Tries sizes from sizeMax down to sizeMin; if text still wraps to more than maxLines at sizeMin, returns first maxLines only.
 */
export function wrapTextMaxLines(
   text: string,
   font: any,
   maxWidth: number,
   maxLines: number,
   sizeMin: number,
   sizeMax: number,
): { lines: string[]; size: number } {
   for (let size = sizeMax; size >= sizeMin; size -= 1) {
      const lines = wrapText(text ?? "", font, size, maxWidth);
      if (lines.length <= maxLines) return { lines, size };
   }
   
   const lines = wrapText(text ?? "", font, sizeMin, maxWidth);
   return { lines: lines.slice(0, maxLines), size: sizeMin };
}

export function getClientsFromIds(
   clientIds: string[] | undefined,
   allClients: Record<string, Clients> | undefined,
): Clients[] {
   if (!clientIds || !allClients) {
      return [];
   }

   return clientIds
      .map((id) => allClients[id])
      .filter((client): client is Clients => client !== undefined);
}
