import * as functions from "firebase-functions/v2";
import { deleteImageByUrl } from "./handleDeletePhoto";
import { db, storage } from "../../utils";

export const editProduct = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { data, auth } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const {
         image: src,
         productChineseName,
         productEnglishName,
         unitPrice,
         productDimension,
         mass,
         packaging,
         packingMass,
         packingVolume,
         saved,
         updatedAt,
         supplier,
         additionalNotes,
         catagory,
         client: clientName,
         currency,
         productId,
      } = data;

      try {
         const productRef = db
            .collection("users")
            .doc(uid)
            .collection("products")
            .doc(productId);
         const snapshot = await productRef.get();
         const prevData = snapshot.data() || {};

         const changedFields: Record<string, any> = {};

         // only update image if a new one is passed
         if (src !== "none") {
            await deleteImageByUrl(prevData.image);

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

            if (prevData.image !== publicUrl) changedFields.image = publicUrl;
         }

         if (prevData.productChineseName !== productChineseName)
            changedFields.productChineseName = productChineseName;

         if (prevData.productEnglishName !== productEnglishName)
            changedFields.productEnglishName = productEnglishName;

         if (prevData.unitPrice !== unitPrice)
            changedFields.unitPrice = unitPrice;
         if (prevData.packaging !== packaging)
            changedFields.packaging = packaging;
         if (prevData.saved !== saved) changedFields.saved = saved;
         if (prevData.updatedAt !== updatedAt)
            changedFields.updatedAt = updatedAt;
         if (prevData.additionalNotes !== additionalNotes)
            changedFields.additionalNotes = additionalNotes;
         if (prevData.catagory !== catagory) changedFields.catagory = catagory;
         if (prevData.client !== clientName) changedFields.client = clientName;
         if (prevData.currency !== currency) changedFields.currency = currency;

         if (JSON.stringify(prevData.mass || {}) !== JSON.stringify(mass)) {
            changedFields.mass = mass;
         }

         if (
            JSON.stringify(prevData.productDimension || {}) !==
            JSON.stringify(productDimension)
         ) {
            changedFields.productDimension = productDimension;
         }

         if (
            JSON.stringify(prevData.packingMass || {}) !==
            JSON.stringify(packingMass)
         ) {
            changedFields.packingMass = packingMass;
         }

         if (
            JSON.stringify(prevData.packingVolume || {}) !==
            JSON.stringify(packingVolume)
         ) {
            changedFields.packingVolume = packingVolume;
         }

         if (
            JSON.stringify(prevData.supplier || {}) !== JSON.stringify(supplier)
         ) {
            changedFields.supplier = supplier;
         }

         if (Object.keys(changedFields).length > 0) {
            changedFields.productId = productId;
            await productRef.set(changedFields, { merge: true });
         }

         return { success: true, updatedFields: Object.keys(changedFields) };
      } catch (err) {
         console.error(err);
         throw new functions.https.HttpsError(
            "internal",
            "Error in editing product"
         );
      }
   }
);
