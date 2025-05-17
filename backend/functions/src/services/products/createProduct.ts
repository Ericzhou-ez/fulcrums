import * as functions from "firebase-functions/v2";
import { db } from "../../utils";
import { uploadBlobAsJPG } from "../lib/upload_blob_as_jpg";
import * as admin from "firebase-admin";

const bucket = admin.storage().bucket();

export const createProduct = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { data, auth } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const errors: string[] = [];
      const {
         image,
         productChineseName,
         productEnglishName,
         unitPrice,
         unitMass: { unitMassQuantity, unitMassUnit },
         packing,
         packingMass: { packingMassQuantity, packingMassUnit },
         packingVolume: { length, width, height, packingUnit },
         saved,
         updatedAt,
         supplier: {
            supplierName,
            supplierAddress,
            supplierPhoneNumber,
            supplierEmail,
         },
         additionalNotes,
         clients,
         currency,
         hsCode,
         material,
      } = data;

      const required = {
         productChineseName,
         productEnglishName,
         unitPrice,
         packing,
         length,
         width,
         height,
         packingUnit,
         supplierName,
      };
      
      // validate
      for (const [k, v] of Object.entries(required)) {
         let value = v;
         if (typeof value !== "string") value = String(value);

         if (!value || value.trim().length === 0) {
            errors.push(`${v} of ${k} is invalid`);
         }
      }
      for (const [k, v] of Object.entries(required)) {
         if (typeof v === "string") {
            if (v.trim().length === 0) errors.push(`${k} 不能为空`);
         } else if (v === undefined || v === null) {
            errors.push(`${k} 不能为空`);
         }
      }

      if (clients.length > 50) {
         errors.push("Too many clients assigned");
      }
      if (!image) {
         errors.push("No product image");
      }
      for (const client of clients) {
         if (client.length > 100) {
            errors.push(`${client} is not a valid client ID`);
         }
      }

      if (errors.length > 0) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            errors.join("; ")
         );
      }

      // store
      const newProductRef = db
         .collection("users")
         .doc(uid)
         .collection("products")
         .doc();

      const productId = newProductRef.id;
      const productImagePath = `users_${uid}_products_${productId}.jpg`;
      const uploadImagePromise = uploadBlobAsJPG(
         image,
         productId,
         productImagePath
      );
      const uploadProductPromise = newProductRef
         .set(
            {
               image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${productImagePath}?alt=media&token=${productId}`,
               productChineseName,
               productEnglishName,
               unitPrice,
               unitMass: { unitMassQuantity, unitMassUnit },
               packing,
               packingMass: { packingMassQuantity, packingMassUnit },
               packingVolume: { length, width, height, packingUnit },
               saved,
               updatedAt,
               supplier: {
                  supplierName,
                  supplierAddress,
                  supplierPhoneNumber,
                  supplierEmail,
               },
               additionalNotes,
               clients,
               currency,
               hsCode,
               material,
               productId: newProductRef.id,
            },
            { merge: true }
         )
         .catch((err) => {
            functions.logger.error("Error writing to firestore: " + err);
            throw new functions.https.HttpsError(
               "internal",
               "Failed to upload product info"
            );
         });

      try {
         await Promise.all([uploadImagePromise, uploadProductPromise]);

         return { success: true };
      } catch (err) {
         functions.logger.error("addProduct overall failure", err.message, {
            uid: uid,
         });
         throw err;
      }
   }
);
