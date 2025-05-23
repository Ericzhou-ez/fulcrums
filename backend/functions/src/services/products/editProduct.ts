import * as functions from "firebase-functions/v2";
import { deleteImageByUrl } from "./handleDeletePhoto";
import { db } from "../../utils";
import { uploadBlobAsJPG } from "../lib/upload_blob_as_jpg";
import { FieldValue } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

export const editProduct = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { data, auth } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const {
         image,
         productChineseName,
         productEnglishName,
         unitPrice,
         packing,
         packingMass: { packingMassQuantity, packingMassUnit },
         packingVolume: { length, width, height, packingUnit },
         saved,
         updatedAt,
         supplierId,
         additionalNotes,
         clients,
         currency,
         hsCode,
         material,
         productId,
      } = data;

      try {
         const productRef = db
            .collection("users")
            .doc(uid)
            .collection("products")
            .doc(productId);

         const prevProductSnapshot = await productRef.get();

         if (!prevProductSnapshot.exists) {
            throw new functions.https.HttpsError(
               "not-found",
               `产品 ${productId} 不存在`
            );
         }
         const prevProduct = prevProductSnapshot.data();

         if (image !== "none") {
            await deleteImageByUrl(prevProduct.image);
            await uploadBlobAsJPG(
               image,
               productId,
               `users/${uid}/products/${productId}.jpg`
            );
         }

         const updatePayload = {
            productId,
            productChineseName,
            productEnglishName,
            unitPrice,
            packing,
            packingMass: { packingMassQuantity, packingMassUnit },
            packingVolume: { length, width, height, packingUnit },
            saved,
            updatedAt,
            supplierId,
            additionalNotes,
            clients,
            currency,
            hsCode,
            material,
            image:
               image === "none"
                  ? prevProduct.image
                  : `https://firebasestorage.googleapis.com/v0/b/${
                       admin.storage().bucket().name
                    }/o/${encodeURIComponent(
                       `users/${uid}/products/${productId}.jpg`
                    )}?alt=media&token=${productId}`,
         };

         const updateProductPromise = productRef.set(updatePayload, {
            merge: true,
         });

         // Supplier updates
         const updateSupplierPromises = [];

         if (prevProduct.supplierId !== supplierId) {
            
            // Remove productId from old supplier
            if (prevProduct.supplierId) {
               updateSupplierPromises.push(
                  editProductsInSupplier(
                     prevProduct.supplierId,
                     uid,
                     productId,
                     true
                  )
               );
            }
            // Add productId to new supplier
            updateSupplierPromises.push(
               editProductsInSupplier(supplierId, uid, productId, false)
            );
         }

         // Client updates
         const prevClients = prevProduct.clients || [];
         const newClients = clients || [];
         const clientsToAdd = newClients.filter(
            (id) => !prevClients.includes(id)
         );
         const clientsToRemove = prevClients.filter(
            (id) => !newClients.includes(id)
         );

         const updateClientsPromises = [
            ...clientsToAdd.map((clientId) =>
               editProductsInClient(clientId, uid, productId, false)
            ),
            ...clientsToRemove.map((clientId) =>
               editProductsInClient(clientId, uid, productId, true)
            ),
         ];

         await Promise.all([
            updateProductPromise,
            ...updateSupplierPromises,
            ...updateClientsPromises,
         ]);

         return { success: true };
      } catch (err) {
         functions.logger.error("Error editing product:", err, {
            uid,
            productId,
         });
         throw new functions.https.HttpsError(
            "internal",
            `编辑产品失败: ${err.message}`
         );
      }
   }
);

async function editProductsInSupplier(
   supplierId: string,
   uid: string,
   productId: string,
   remove: boolean
) {
   const supplierRef = db
      .collection("users")
      .doc(uid)
      .collection("suppliers")
      .doc(supplierId);
   const supplierDoc = await supplierRef.get();

   if (!supplierDoc.exists) {
      throw new functions.https.HttpsError(
         "not-found",
         `供应商 ${supplierId} 不存在`
      );
   }

   const update = remove
      ? { productIds: FieldValue.arrayRemove(productId) }
      : { productIds: FieldValue.arrayUnion(productId) };

   await supplierRef.update(update);
   return { success: true };
}

async function editProductsInClient(
   clientId: string,
   uid: string,
   productId: string,
   remove: boolean
) {
   const clientRef = db
      .collection("users")
      .doc(uid)
      .collection("clients")
      .doc(clientId);
   const clientDoc = await clientRef.get();

   if (!clientDoc.exists) {
      throw new functions.https.HttpsError(
         "not-found",
         `客户 ${clientId} 不存在`
      );
   }

   const update = remove
      ? { productIds: FieldValue.arrayRemove(productId) }
      : { productIds: FieldValue.arrayUnion(productId) };

   await clientRef.update(update);
   return { success: true };
}
