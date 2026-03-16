import * as functions from "firebase-functions";
import { db } from "../../utils";

function getOrderId(data: unknown): string {
   if (!data || typeof data !== "object") {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "data must contain orderId"
      );
   }
   const orderId = (data as Record<string, unknown>).orderId;
   if (typeof orderId !== "string" || orderId.trim().length === 0) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "orderId is required and must be a non-empty string"
      );
   }
   return orderId.trim();
}

export const deleteOrder = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      if (!req.auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }
      const uid = req.auth.uid;
      const orderId = getOrderId(req.data);

      const orderRef = db
         .collection("users")
         .doc(uid)
         .collection("orders")
         .doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
         throw new functions.https.HttpsError(
            "not-found",
            `订单 ${orderId} 不存在`
         );
      }

      await orderRef.delete();
      return { success: true };
   }
);
