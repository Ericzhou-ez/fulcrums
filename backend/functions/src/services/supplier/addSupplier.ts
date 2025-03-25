import * as admin from "firebase-admin";

const db = admin.firestore();

export const addSupplierInternal = async (
   supplierData: {
      name: string;
      phone: string;
      address: string;
      email: string;
      productId: string; 
   },
   uid: string
): Promise<string> => {
   const suppliersRef = db.collection("users").doc(uid).collection("suppliers");
   const querySnapshot = await suppliersRef
      .where("name", "==", supplierData.name)
      .get();

   if (!querySnapshot.empty) {
      // exists; updates product if
      const existingSupplierDoc = querySnapshot.docs[0]; // requires unique supplier names 
      const existingSupplierRef = existingSupplierDoc.ref;

      await existingSupplierRef.update({
         productIds: admin.firestore.FieldValue.arrayUnion(
            supplierData.productId
         ),
      });

      return existingSupplierDoc.id;
   } else {
      // new supplier and product id 
      const newSupplierRef = suppliersRef.doc();
      const supplierId = newSupplierRef.id;

      await newSupplierRef.set({
         supplierId,
         name: supplierData.name,
         phone: supplierData.phone,
         address: supplierData.address,
         email: supplierData.email,
         productIds: [supplierData.productId],
      });

      return supplierId;
   }
};
