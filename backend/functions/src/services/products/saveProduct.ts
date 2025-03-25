import { db } from "./createProduct";
import * as functions from "firebase-functions/v2";

export const saveUnsavedProduct = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { auth, data } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const productId = data;
      const uid = auth.uid;

      try {
         const productRef = db
            .collection("users")
            .doc(uid)
            .collection("products")
            .doc(productId);
         const productSnap = await productRef.get();

         if (!productSnap.exists) {
            throw new functions.https.HttpsError("not-found", "没有产品");
         }

         const productData = productSnap.data();
         const currentSaved = productData?.saved ?? false; // false by default

         await productRef.update({ saved: !currentSaved });

         return { success: true, saved: !currentSaved };
      } catch (err) {
         throw new functions.https.HttpsError(
            "internal",
            "无法更新产品 'saved'" + err
         );
      }
   }
);
