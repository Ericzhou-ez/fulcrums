import * as functions from "firebase-functions/v2";
import { addClientInternal } from "../client/addClient";
import { addSupplierInternal } from "../supplier/addSupplier";
import { db, storage } from "../../utils";

// this also updates product if it already exists
export const createProduct = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { data, auth } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const {
         image: src,
         productChineseName: productChineseName,
         productEnglishName: productEnglishName,
         unitPrice,
         productDimension: { volume: productVolume, unit: dimensionUnit },
         mass: { quantity: mass, unit: massUnit },
         packaging,
         packingMass: { quantity: packingMass, unit: packingMassUnit },
         packingVolume: { volume: packingVolume, unit: packingDimensionUnit },
         saved,
         updatedAt,
         supplier: {
            name: supplierName,
            phone: supplierPhone,
            address: supplierAddress,
            email: supplierEmail,
         },
         additionalNotes,
         catagory: productCatagory,
         client: clientName,
         currency: currency,
      } = data;

      if (!productChineseName || !productEnglishName) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            "Not sufficient fields"
         );
      }

      try {
         const productRef = db
            .collection("users")
            .doc(uid)
            .collection("products")
            .doc();
         const productId = productRef.id;

         const bucket = storage.bucket();
         const storagePath = `users/${uid}/products/${productId}`;
         const file = bucket.file(storagePath);

         const buffer = Buffer.from(src, "base64");
         await file.save(buffer, {
            contentType: "image/jpeg",
            metadata: {
               firebaseStorageDownloadTokens: productId,
            },
         });

         const token = productId;
         const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
         }/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;

         await Promise.all([
            productRef.set(
               {
                  productId,
                  image: publicUrl,
                  productChineseName: productChineseName,
                  productEnglishName: productEnglishName,
                  packingMass: {
                     packingMass: packingMass,
                     packingMassUnit: packingMassUnit,
                  },
                  unitPrice,
                  productDimension: {
                     volume: productVolume,
                     unit: dimensionUnit,
                  },
                  mass: { quantity: mass, unit: massUnit },
                  packaging,
                  packingVolume: {
                     volume: packingVolume,
                     unit: packingDimensionUnit,
                  },
                  saved,
                  updatedAt,
                  supplier: {
                     name: supplierName,
                     phone: supplierPhone,
                     address: supplierAddress,
                     email: supplierEmail,
                  },
                  additionalNotes,
                  catagory: productCatagory,
                  client: clientName,
                  currency: currency,
               },
               { merge: true } // merge with existing data (if there)
            ),
            addClientInternal(
               { clientName: clientName, productId: productId },
               uid
            ),
            addSupplierInternal(
               {
                  name: supplierName,
                  phone: supplierPhone,
                  address: supplierAddress,
                  email: supplierEmail,
                  productId: productId,
               },
               uid
            ),
         ]);

         return { success: true, productId, imageUrl: publicUrl };
      } catch (err) {
         console.error(err);
         throw new functions.https.HttpsError(
            "internal",
            "Error in adding new product"
         );
      }
   }
);
