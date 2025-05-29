import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { uploadBlobAsJPG } from "./lib/upload_blob_as_jpg";
import { Supplier, Clients, Product } from "../types/types";

const db = admin.firestore();

interface SyncPayload {
   suppliers: Supplier[];
   clients: Clients[];
   products: Product[];
}

export const syncAll = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      if (!req.auth) {
         throw new functions.https.HttpsError("unauthenticated", "请先登录");
      }
      const uid = req.auth.uid;

      const { suppliers, clients, products } = req.data as SyncPayload;

      if (
         suppliers.length > 50 ||
         clients.length > 50 ||
         products.length > 120
      ) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            "超过批量上限：最多 50 供应商 / 50 客户 / 120 产品"
         );
      }

      const userRef = db.collection("users").doc(uid);
      const supplierCol = userRef.collection("suppliers");
      const clientCol = userRef.collection("clients");
      const productCol = userRef.collection("products");

      const writer = db.bulkWriter();

      suppliers.forEach((s) =>
         writer.set(supplierCol.doc(s.supplierId), s, { merge: true })
      );

      clients.forEach((c) =>
         writer.set(clientCol.doc(c.clientId), c, { merge: true })
      );

      await writer.close(); 

      for (const p of products) {
         const prodRef = productCol.doc(p.productId || undefined);
         const productId = prodRef.id;

         let imageUrl = p.image;
         const b64 = p.image;

         if (b64) {
            const imagePath = `users/${uid}/products/${productId}.jpg`;
            imageUrl = await uploadBlobAsJPG(b64, productId, imagePath);
         }

         const productData = { ...p, image: imageUrl, productId };
         await prodRef.set(productData, { merge: true });

         await supplierCol
            .doc(p.supplierId)
            .set(
               { productIds: FieldValue.arrayUnion(productId) },
               { merge: true }
            );

         const clientBatches = p.clients.map((cid) =>
            clientCol
               .doc(cid)
               .set(
                  { productIds: FieldValue.arrayUnion(productId) },
                  { merge: true }
               )
         );
         await Promise.all(clientBatches);
      }

      return { success: true };
   }
);
