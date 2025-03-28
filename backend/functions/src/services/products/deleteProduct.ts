import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";
import { db } from "../../utils";
import { deleteImageByUrl } from "./handleDeletePhoto";

export const deleteProduct = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { productId } = req.data;
      const auth = req.auth;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const productRef = db
         .collection("users")
         .doc(uid)
         .collection("products")
         .doc(productId);

      const productSnap = await productRef.get();

      if (!productSnap.exists) {
         throw new functions.https.HttpsError("not-found", "产品不存在");
      }

      const productData = productSnap.data();

      try {
         // delete image
         if (productData?.image) {
            await deleteImageByUrl(productData.image);
         }

         // delete doc
         await productRef.delete();

         // remove from client and supplier arrays
         await Promise.all([
            removeProductFromClient(uid, productData.client, productId),
            removeProductFromSupplier(
               uid,
               productData.supplier.name,
               productId
            ),
         ]);

         return { success: true };
      } catch (err) {
         console.error("删除产品失败:", err);
         throw new functions.https.HttpsError("internal", "删除产品时发生错误");
      }
   }
);

const removeProductFromClient = async (
   uid: string,
   clientName: string,
   productId: string
) => {
   const clientRef = db
      .collection("users")
      .doc(uid)
      .collection("clients")
      .doc(clientName);
   await clientRef.update({
      products: admin.firestore.FieldValue.arrayRemove(productId),
   });
};

const removeProductFromSupplier = async (
   uid: string,
   supplierName: string,
   productId: string
) => {
   const supplierRef = db
      .collection("users")
      .doc(uid)
      .collection("suppliers")
      .doc(supplierName);
   await supplierRef.update({
      products: admin.firestore.FieldValue.arrayRemove(productId),
   });
};