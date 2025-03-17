import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";
import { addClientInternal } from "../client/addClient";
import { addSupplierInternal } from "../supplier/addSupplier";

const db = admin.firestore();
const storage = admin.storage();

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
         name: productName,
         unitPrice,
         productDimension: { volume: productVolume, unit: dimensionUnit },
         mass: { quantity: mass, unit: massUnit },
         packaging,
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
      } = data;

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

         await productRef.set(
            {
               productId,
               image: publicUrl,
               name: productName,
               unitPrice,
               productDimension: {
                  volume: parseInt(productVolume),
                  unit: dimensionUnit,
               },
               mass: { quantity: mass, unit: massUnit },
               packaging,
               packingVolume: {
                  volume: parseInt(packingVolume),
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
            },
            { merge: true } // merge with existing data
         );

         await addClientInternal(clientName, uid);
         await addSupplierInternal(
            {
               name: supplierName,
               phone: supplierPhone,
               address: supplierAddress,
               email: supplierEmail,
            },
            uid
         );

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
