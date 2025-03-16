import * as admin from "firebase-admin";

const db = admin.firestore();

export const addClientInternal = async (
   clientName: string,
   uid: string
): Promise<string> => {
   const clientsRef = db.collection("users").doc(uid).collection("clients");
   const querySnapshot = await clientsRef.where("name", "==", clientName).get(); // if exists will return the id

   if (!querySnapshot.empty) {
      // exists
      return querySnapshot.docs[0].id;
   } else {
      // new client
      const newClientRef = clientsRef.doc();
      const clientId = newClientRef.id;
      await newClientRef.set({ clientId, name: clientName });
      return clientId;
   }
};
