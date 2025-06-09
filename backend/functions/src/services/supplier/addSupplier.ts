import * as functions from "firebase-functions";
import { db } from "../../utils";

export const addSupplier = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { auth, data } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const { supplierName, supplierAddress, supplierEmail, supplierPhone } =
         data;

      const supplierData = {
         supplierName,
         supplierAddress,
         supplierEmail,
         supplierPhone,
      };

      const newSupplierRef = db
         .collection("users")
         .doc(uid)
         .collection("suppliers")
         .doc();

      await newSupplierRef.set(
         {
            ...supplierData,
            supplierId: newSupplierRef.id,
            updatedAt: new Date().toISOString(),
         },
         {
            merge: true,
         }
      );

      return { success: true, supplierId: newSupplierRef.id };
   }
);
