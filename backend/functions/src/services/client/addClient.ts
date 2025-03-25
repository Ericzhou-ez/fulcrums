import * as admin from "firebase-admin";

const db = admin.firestore();

export const addClientInternal = async (
   clientData: { clientName: string; productId: string },
   uid: string
): Promise<string> => {
   const clientsRef = db.collection("users").doc(uid).collection("clients");
   const querySnapshot = await clientsRef
      .where("name", "==", clientData.clientName)
      .get(); // if exists return s the id

   if (!querySnapshot.empty) {
      // exists
      const clientSnapshotRef = querySnapshot.docs[0].ref;
      await clientSnapshotRef.update({
         products: admin.firestore.FieldValue.arrayUnion(clientData.productId),
      });

      return querySnapshot.docs[0].id;
   } else {
      // new client
      const newClientRef = clientsRef.doc();
      const clientId = newClientRef.id;
      await newClientRef.set({
         clientId,
         name: clientData.clientName,
         products: [clientData.productId],
      });

      return clientId;
   }
};
