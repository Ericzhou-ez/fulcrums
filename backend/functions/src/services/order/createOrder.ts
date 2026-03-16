import * as functions from "firebase-functions";
import { db } from "../../utils";
import type { OrderProductLineItem, OrderStatus } from "../../types/types";

const DEFAULT_STATUS: OrderStatus = "draft";

const TRANSPORT_MODES = ["sea", "air", "road", "rail"] as const;

function validateCreateOrderData(data: unknown): {
   orderName: string;
   clientId: string;
   products: OrderProductLineItem[];
   incoterms: string;
   portOfLoading: string;
   portOfDischarge: string;
   transportMode: "sea" | "air" | "road" | "rail";
   estimatedShipmentDate: string;
} {
   if (!data || typeof data !== "object") {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "data must be an object with orderName, clientId, products, and shipping fields",
      );
   }
   const raw = data as Record<string, unknown>;

   const orderName =
      typeof raw.orderName === "string" ? raw.orderName.trim() : "";
   if (!orderName) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "orderName is required and must be a non-empty string",
      );
   }

   const clientId = typeof raw.clientId === "string" ? raw.clientId.trim() : "";
   if (!clientId) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "clientId is required and must be a non-empty string",
      );
   }

   if (!Array.isArray(raw.products)) {
      throw new functions.https.HttpsError(
         "invalid-argument",
         "products must be an array of { productId, quantity, quantityUnit }",
      );
   }
   const products: OrderProductLineItem[] = [];
   for (let i = 0; i < raw.products.length; i++) {
      const item = raw.products[i];
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
         "至少需要一项数量大于 0 的产品",
      );
   }

   const incoterms =
      typeof raw.incoterms === "string" ? raw.incoterms.trim() : "";
   const portOfLoading =
      typeof raw.portOfLoading === "string" ? raw.portOfLoading.trim() : "";
   const portOfDischarge =
      typeof raw.portOfDischarge === "string" ? raw.portOfDischarge.trim() : "";
   const transportModeRaw = raw.transportMode;
   const transportMode =
      typeof transportModeRaw === "string" &&
      TRANSPORT_MODES.includes(
         transportModeRaw as (typeof TRANSPORT_MODES)[number],
      )
         ? (transportModeRaw as "sea" | "air" | "road" | "rail")
         : "sea";
   const estimatedShipmentDate =
      typeof raw.estimatedShipmentDate === "string"
         ? raw.estimatedShipmentDate.trim()
         : "";

   return {
      orderName,
      clientId,
      products,
      incoterms,
      portOfLoading,
      portOfDischarge,
      transportMode,
      estimatedShipmentDate,
   };
}

export const createOrder = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      if (!req.auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }
      const uid = req.auth.uid;
      const validated = validateCreateOrderData(req.data);

      const clientRef = db
         .collection("users")
         .doc(uid)
         .collection("clients")
         .doc(validated.clientId);
      const clientDoc = await clientRef.get();
      if (!clientDoc.exists) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            `客户 ${validated.clientId} 不存在`,
         );
      }

      const productIds = [
         ...new Set(validated.products.map((p) => p.productId)),
      ];
      const productRefs = productIds.map((id) =>
         db.collection("users").doc(uid).collection("products").doc(id),
      );
      const productDocs = await db.getAll(...productRefs);
      const missing = productIds.filter((_, i) => !productDocs[i].exists);
      if (missing.length > 0) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            `以下产品不存在: ${missing.join(", ")}`,
         );
      }

      const ordersRef = db.collection("users").doc(uid).collection("orders");
      const newOrderRef = ordersRef.doc();
      const now = new Date().toISOString();

      await newOrderRef.set({
         orderId: newOrderRef.id,
         orderName: validated.orderName,
         clientId: validated.clientId,
         products: validated.products,
         incoterms: validated.incoterms,
         portOfLoading: validated.portOfLoading,
         portOfDischarge: validated.portOfDischarge,
         transportMode: validated.transportMode,
         estimatedShipmentDate: validated.estimatedShipmentDate,
         createdAt: now,
         updatedAt: now,
         status: DEFAULT_STATUS,
      });

      return { success: true, orderId: newOrderRef.id };
   },
);
