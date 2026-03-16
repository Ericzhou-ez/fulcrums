import * as functions from "firebase-functions";
import { db } from "../../utils";
import type { OrderStatus } from "../../types/types";

const VALID_STATUSES: OrderStatus[] = [
   "draft",
   "shipped",
   "customs_clearance",
   "delivered",
   "cancelled",
];

function validateUpdateStateData(data: unknown): {
   orderId: string;
   status: OrderStatus;
} {
   if (!data || typeof data !== "object") {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "data must contain orderId and status"
      );
   }
   const payload = data as Record<string, unknown>;
   const orderId =
      typeof payload.orderId === "string" ? payload.orderId.trim() : "";
   const statusRaw = payload.status;
   const status =
      typeof statusRaw === "string" && VALID_STATUSES.includes(statusRaw as OrderStatus)
         ? (statusRaw as OrderStatus)
         : null;

   if (!orderId) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "orderId is required"
      );
   }
   if (!status) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         `status must be one of: ${VALID_STATUSES.join(", ")}`
      );
   }
   return { orderId, status };
}

export const updateOrderState = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      if (!req.auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }
      const uid = req.auth.uid;
      const { orderId, status } = validateUpdateStateData(req.data);

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

      const now = new Date().toISOString();
      await orderRef.update({ status, updatedAt: now });

      return { success: true, orderId, status };
   }
);
