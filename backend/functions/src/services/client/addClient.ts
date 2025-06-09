import * as functions from "firebase-functions";
import { db } from "../../utils";

export const addClient = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { auth, data } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const uid = auth.uid;
      const errors: string[] = [];
      const {
         companyName,
         vatNumber,
         eoriNumber,
         address,
         contactName,
         contactPhoneNumber,
         contactEmail,
      } = data;

      const required = {
         companyName,
         address,
         contactName,
         contactPhoneNumber,
      };
      const clientData = { ...required, vatNumber, eoriNumber, contactEmail };

      for (const [k, v] of Object.entries(required)) {
         if (!v || typeof v !== "string" || v.trim().length === 0) {
            errors.push(`${v} is not a valid value for ${k}`);
         }
      }
      for (const [k, v] of Object.entries(clientData)) {
         if (v.trim().length >= 250) {
            errors.push(`${v} for ${k} is longer than 250 characters`);
         }
      }

      if (errors.length > 0) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            errors.join("; ")
         );
      }

      const newClientRef = db
         .collection("users")
         .doc(uid)
         .collection("clients")
         .doc();
      await newClientRef.set(
         {
            ...clientData,
            clientId: newClientRef.id,
            updatedAt: new Date().toISOString(),
         },
         {
            merge: true,
         }
      );

      return { success: true, clientId: newClientRef.id };
   }
);
