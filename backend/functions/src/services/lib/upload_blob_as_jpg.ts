import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

const bucket = admin.storage().bucket();

export async function uploadBlobAsJPG(image: any, token: string, path: string) {
   const file = bucket.file(path);
   const buffer = Buffer.from(image, "base64");      

   try {
      await file.save(buffer, {
         metadata: {
            contentType: "image/jpeg",
            metadata: {
               firebaseStorageDownloadTokens: token,
            },
         },
      });

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${path}?alt=media&token=${token}`;

      return publicUrl;
   } catch {
      throw new functions.https.HttpsError("internal", "Failed to upload photo");
   }
}
