import { logger } from "firebase-functions";
import { storage } from "../../utils";

export async function deleteImageByUrl(publicUrl: string) {
   try {
      const url = new URL(publicUrl);
      const encodedPath = url.pathname.split("/o/")[1];
      if (!encodedPath) throw new Error("Invalid Firebase Storage URL");

      const filePath = decodeURIComponent(encodedPath).replace(/^\//, ""); // converts %2F to /

      const bucket = storage.bucket();
      const file = bucket.file(filePath);
      const [exists] = await file.exists();
      if (!exists) {
         logger.error("File does not exist:", filePath);
         return;
      }

      await file.delete();

      logger.info("File deleted:", filePath);
   } catch (err) {
      logger.error("Deletion failed:", {
         message: (err as Error).message,
         stack: (err as Error).stack,
         publicUrl,
      });
   }
}
