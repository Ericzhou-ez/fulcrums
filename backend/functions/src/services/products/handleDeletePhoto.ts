import { logger } from "firebase-functions";
import { storage } from "../../utils";

export async function deleteImageByUrl(publicUrl: string) {
   try {
      // extract path 
      const match = decodeURIComponent(publicUrl).match(/\/o\/(.+)\?alt/);
      const filePath = match?.[1];

      if (!filePath) {
         throw new Error("invalid firebase Storage URL");
      }

      const bucket = storage.bucket();
      await bucket.file(filePath).delete();

   } catch (err) {
      logger.error("error deleting file:", err);
   }
}
