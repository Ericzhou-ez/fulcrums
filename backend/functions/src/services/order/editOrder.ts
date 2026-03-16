import * as functions from "firebase-functions";
import { db } from "../../utils";
import type { OrderProductLineItem, OrderStatus } from "../../types/types";

const VALID_STATUSES: OrderStatus[] = [
   "draft",
   "shipped",
   "customs_clearance",
   "delivered",
   "cancelled",
];

const TRANSPORT_MODES = ["sea", "air", "road", "rail"] as const;

function validateEditOrderData(data: unknown): {
   orderId: string;
   orderName: string;
   clientId: string;
   products: OrderProductLineItem[];
   incoterms: string;
   portOfLoading: string;
   portOfDischarge: string;
   transportMode: "sea" | "air" | "road" | "rail";
   estimatedShipmentDate: string;
   status: OrderStatus;
} {
   if (!data || typeof data !== "object") {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "data must be an object with orderId, orderName, clientId, products, shipping fields, and status"
      );
   }
   const payload = data as Record<string, unknown>;

   const orderId =
      typeof payload.orderId === "string" ? payload.orderId.trim() : "";
   const orderName =
      typeof payload.orderName === "string" ? payload.orderName.trim() : "";
   const clientId =
      typeof payload.clientId === "string" ? payload.clientId.trim() : "";
   const statusRaw = payload.status;
   const status =
      typeof statusRaw === "string" && VALID_STATUSES.includes(statusRaw as OrderStatus)
         ? (statusRaw as OrderStatus)
         : "draft";

   if (!orderId) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "orderId is required"
      );
   }
   if (!orderName) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "orderName is required"
      );
   }
   if (!clientId) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "clientId is required"
      );
   }

   const rawProducts = payload.products;
   if (!Array.isArray(rawProducts)) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "products must be an array of { productId, quantity, quantityUnit }"
      );
   }
   const products: OrderProductLineItem[] = [];
   for (const item of rawProducts) {
      if (!item || typeof item !== "object") continue;
      
      const obj = item as Record<string, unknown>;

      const productId =
         typeof obj.productId === "string" ? obj.productId.trim() : "";
      const rawQty = obj.quantity;

      const quantity =
         typeof rawQty === "number" && !Number.isNaN(rawQty) && rawQty >= 0
            ? Math.floor(rawQty)
            : typeof rawQty === "string"
              ? Math.max(0, Math.floor(parseInt(rawQty, 10) || 0))
              : 0;

      if (!productId || quantity <= 0) continue;
      products.push({ productId, quantity });
   }
   if (products.length === 0) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "至少需要一项数量大于 0 的产品"
      );
   }

   const incoterms =
      typeof payload.incoterms === "string" ? payload.incoterms.trim() : "";
   const portOfLoading =
      typeof payload.portOfLoading === "string" ? payload.portOfLoading.trim() : "";
   const portOfDischarge =
      typeof payload.portOfDischarge === "string" ? payload.portOfDischarge.trim() : "";
   const transportModeRaw = payload.transportMode;
   const transportMode =
      typeof transportModeRaw === "string" &&
      TRANSPORT_MODES.includes(transportModeRaw as (typeof TRANSPORT_MODES)[number])
         ? (transportModeRaw as "sea" | "air" | "road" | "rail")
         : "sea";
   const estimatedShipmentDate =
      typeof payload.estimatedShipmentDate === "string"
         ? payload.estimatedShipmentDate.trim()
         : "";

   return {
      orderId,
      orderName,
      clientId,
      products,
      incoterms,
      portOfLoading,
      portOfDischarge,
      transportMode,
      estimatedShipmentDate,
      status,
   };
}

export const editOrder = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      if (!req.auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }
      const uid = req.auth.uid;
      const validated = validateEditOrderData(req.data);

      const orderRef = db
         .collection("users")
         .doc(uid)
         .collection("orders")
         .doc(validated.orderId);
      const orderDoc = await orderRef.get();
      if (!orderDoc.exists) {
         throw new functions.https.HttpsError(
            "not-found",
            `订单 ${validated.orderId} 不存在`
         );
      }

      const clientRef = db
         .collection("users")
         .doc(uid)
         .collection("clients")
         .doc(validated.clientId);
      const clientDoc = await clientRef.get();
      if (!clientDoc.exists) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            `客户 ${validated.clientId} 不存在`
         );
      }

      const productIds = [...new Set(validated.products.map((p) => p.productId))];
      const productRefs = productIds.map((id) =>
         db.collection("users").doc(uid).collection("products").doc(id)
      );
      const productDocs = await db.getAll(...productRefs);
      const missing = productIds.filter((_, i) => !productDocs[i].exists);
      if (missing.length > 0) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            `以下产品不存在: ${missing.join(", ")}`
         );
      }

      const existing = orderDoc.data();
      const now = new Date().toISOString();
      await orderRef.set(
         {
            orderId: validated.orderId,
            orderName: validated.orderName,
            clientId: validated.clientId,
            products: validated.products,
            incoterms: validated.incoterms,
            portOfLoading: validated.portOfLoading,
            portOfDischarge: validated.portOfDischarge,
            transportMode: validated.transportMode,
            estimatedShipmentDate: validated.estimatedShipmentDate,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
            status: validated.status,
         },
         { merge: true }
      );

      return { success: true, orderId: validated.orderId };
   }
);
