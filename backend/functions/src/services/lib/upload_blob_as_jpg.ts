import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

const bucket = admin.storage().bucket();

function parseBase64Image(input: string): { mime: string; data: string } {
   const match = input.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
   if (match) {
      return {
         mime: match[1],
         data: match[2].replace(/\s/g, ""),
      };
   }

   // Assume raw base64 string and default to jpeg this is going to corrupt the file if png so front end make sure to send mime
   return {
      mime: "image/jpeg",
      data: input.replace(/\s/g, ""),
   };
}

export async function uploadBlobAsJPG(
   imageInput: string,
   token: string,
   path: string
): Promise<string> {
   try {
      const { mime, data } = parseBase64Image(imageInput);
      const buffer = Buffer.from(data, "base64");

      if (buffer.length === 0) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            "Image buffer is empty"
         );
      }

      const file = bucket.file(path);

      await file.save(buffer, {
         metadata: {
            contentType: mime,
            metadata: {
               firebaseStorageDownloadTokens: token,
            },
         },
      });

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
         bucket.name
      }/o/${encodeURIComponent(path)}?alt=media&token=${token}`;

      return publicUrl;
   } catch (err) {
      console.error("Image upload failed:", err);
      throw new functions.https.HttpsError(
         "internal",
         "Failed to upload image"
      );
   }
}
