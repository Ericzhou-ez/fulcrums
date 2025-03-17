import { useEffect } from "react";

export const usePreloadImage = (src: string) => {
   useEffect(() => {
      if (!src) return;
      const img = new Image();
      img.src = src;
   }, [src]);
};
