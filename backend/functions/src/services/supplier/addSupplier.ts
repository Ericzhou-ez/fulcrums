import * as admin from "firebase-admin";

const db = admin.firestore();

export const addSupplierInternal = async (
   supplierData: {
      name: string;
      phone: string;
      address: string;
      email: string;
   },
   uid: string
): Promise<string> => {
   const suppliersRef = db.collection("users").doc(uid).collection("suppliers");
   const querySnapshot = await suppliersRef
      .where("name", "==", supplierData.name)
      .get();

   if (!querySnapshot.empty) {
      // exists
      return querySnapshot.docs[0].id;
   } else {
      // new supplier
      const newSupplierRef = suppliersRef.doc();
      const supplierId = newSupplierRef.id;
      await newSupplierRef.set({ supplierId, ...supplierData });
      return supplierId;
   }
};
