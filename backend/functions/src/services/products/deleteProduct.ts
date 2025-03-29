import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";
import { db } from "../../utils";
import { deleteImageByUrl } from "./handleDeletePhoto";

export const deleteProducts = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { productIds } = req.data;
      const auth = req.auth;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;

      if (!Array.isArray(productIds) || productIds.length === 0) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            "必须提供一个有效的产品 ID array"
         );
      }

      const results = await Promise.allSettled(
         productIds.map(async (productId) => {
            const productRef = db
               .collection("users")
               .doc(uid)
               .collection("products")
               .doc(productId);

            const productSnap = await productRef.get();

            if (!productSnap.exists) {
               throw new functions.https.HttpsError(
                  "not-found",
                  `产品 ${productId} 不存在`
               );
            }

            const productData = productSnap.data();

            // delete existing image
            if (productData?.image) {
               await deleteImageByUrl(productData.image);
            }

            // delete doc
            await productRef.delete();

            // remove product id from client and supplier product arrays
            await Promise.all([
               removeProductFromClient(uid, productData.clientId, productId),
               removeProductFromSupplier(
                  uid,
                  productData.supplier.supplierId,
                  productId
               ),
            ]);
         })
      );

      const summary = results.map((res, idx) => ({
         productId: productIds[idx],
         status: res.status,
         reason:
            res.status === "rejected"
               ? (res as PromiseRejectedResult).reason.message
               : null,
      }));

      return {
         success: true,
         summary,
      };
   }
);

const removeProductFromClient = async (
   uid: string,
   clientId: string,
   productId: string
) => {
   if (!clientId) return console.warn("Missing client ID");
   const clientRef = db
      .collection("users")
      .doc(uid)
      .collection("clients")
      .doc(clientId);

   await clientRef.update({
      products: admin.firestore.FieldValue.arrayRemove(productId),
   });
};

const removeProductFromSupplier = async (
   uid: string,
   supplierId: string,
   productId: string
) => {
   if (!supplierId) return console.warn("Missing supplier ID");
   const supplierRef = db
      .collection("users")
      .doc(uid)
      .collection("suppliers")
      .doc(supplierId);

   await supplierRef.update({
      products: admin.firestore.FieldValue.arrayRemove(productId),
   });
};
