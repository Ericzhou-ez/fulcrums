import * as functions from "firebase-functions";
import { db } from "../../utils";

export const deleteSupplier = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { auth, data } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const { supplierId } =
         data;


      const supplierRef = db
         .collection("users")
         .doc(uid)
         .collection("suppliers")
         .doc(supplierId);
      const supplierDoc = await supplierRef.get();

      if (!supplierDoc.exists) {
         throw new functions.https.HttpsError(
            "not-found",
            `Supplier with ID ${supplierId} not found`
         );
      }

      await supplierRef.delete();

      return { success: true };
   }
);
