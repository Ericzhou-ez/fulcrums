import * as functions from "firebase-functions";
import { db } from "../../utils";

export const editSupplier = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { auth, data } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const { supplierName, supplierAddress, supplierEmail, supplierPhone, supplierId } =
         data;

      const supplierData = {
         supplierName,
         supplierAddress,
         supplierEmail,
         supplierPhone,
         supplierId,
      };

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

      await supplierRef.set(
         {
            ...supplierData,
            updatedAt: new Date().toISOString(),
         },
         {
            merge: true,
         }
      );

      return { success: true, supplierId: supplierId };
   }
);
