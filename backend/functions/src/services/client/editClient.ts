import * as functions from "firebase-functions";
import { db } from "../../utils";

export const editClient = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { auth, data } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const {
         companyName,
         vatNumber,
         eoriNumber,
         address,
         contactName,
         contactPhoneNumber,
         contactEmail,
         clientId,
         updatedAt,
      } = data;

      const clientData = {
         companyName,
         address,
         contactName,
         contactPhoneNumber,
         clientId,
         vatNumber,
         eoriNumber,
         contactEmail,
         updatedAt,
      };

      const clientRef = db
         .collection("users")
         .doc(uid)
         .collection("clients")
         .doc(clientId);

      const clientDoc = await clientRef.get();

      if (!clientDoc.exists) {
         throw new functions.https.HttpsError(
            "not-found",
            `Client with ID ${clientId} not found`
         );
      }

      await clientRef.set(
         {
            ...clientData,
         },
         {
            merge: true,
         }
      );

      return { success: true, clientId: clientId };
   }
);
