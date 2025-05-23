import * as functions from "firebase-functions/v2";
import { deleteImageByUrl } from "./handleDeletePhoto";
import { db } from "../../utils";
import { uploadBlobAsJPG } from "../lib/upload_blob_as_jpg";
import { FieldValue } from "firebase-admin/firestore";

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

         // Get previous data to delete old image
         const prevData = (await productRef.get()).data() || {};

         if (image !== "none") {
            await deleteImageByUrl(prevData.image);
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
         };

         const updateProductPromise = productRef.set(updatePayload, {
            merge: true,
         });

         const prevProductRef = db
            .collection("users")
            .doc(uid)
            .collection("products")
            .doc(productId);
         const prevProductSnapshot = await prevProductRef.get();
         const prevProduct = prevProductSnapshot.data();

         const updateSupplierPromise = editProductsInSupplier(
            supplierId,
            uid,
            prevProduct?.productId,
            productId
         );

         const updateClientsPromises = clients.map((clientId: string) =>
            editProductsInClient(
               clientId,
               uid,
               prevProduct.productId,
               productId
            )
         );

         await Promise.all([
            updateProductPromise,
            updateSupplierPromise,
            ...updateClientsPromises,
         ]);

         return { success: true };
      } catch (err) {
         console.error(err);

         throw new functions.https.HttpsError(
            "internal",
            "Error in editing product"
         );
      }
   }
);

async function editProductsInSupplier(
   supplierId: string,
   uid: string,
   oldProductId: string,
   newProductId: string
) {
   const supplierRef = db
      .collection("users")
      .doc(uid)
      .collection("suppliers")
      .doc(supplierId);
   const supplierDoc = await supplierRef.get();

   if (!supplierDoc.exists) {
      throw new functions.https.HttpsError(
         "data-loss",
         `${supplierDoc} does not exist`
      );
   }

   await supplierRef.update({
      productIds: FieldValue.arrayRemove(oldProductId),
   });
   await supplierRef.update({
      productIds: FieldValue.arrayUnion(newProductId),
   });

   return { success: true };
}

export async function editProductsInClient(
   clientId: string,
   uid: string,
   oldProductId: string,
   newProductId: string
) {
   const clientRef = db
      .collection("users")
      .doc(uid)
      .collection("clients")
      .doc(clientId);

   const clientDoc = await clientRef.get();

   if (!clientDoc.exists) {
      throw new functions.https.HttpsError(
         "data-loss",
         `Client ${clientId} does not exist`
      );
   }

   await clientRef.update({
      productIds: FieldValue.arrayRemove(oldProductId),
   });

   await clientRef.update({
      productIds: FieldValue.arrayUnion(newProductId),
   });

   return { success: true };
}
