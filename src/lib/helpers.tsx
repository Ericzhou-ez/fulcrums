// ____helpers____

/**
 * Detect if a string contains at least one CJK character.
 * Always coerce "" if nullish
 */
export function hasChinese(text: string | undefined | null): boolean {
   const safe = text ?? "";
   return /[\u3400-\u9FFF]/.test(safe);
}

export function wrapText(text: string, font: any, size: number, maxWidth: number) {
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
