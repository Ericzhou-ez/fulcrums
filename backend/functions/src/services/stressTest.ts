import * as functions from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../utils";

const REAL_CLIENT_IDS = [
   "1rSuwo2q1wGax0ZogGY6",
   "7rZydMRD1iyJgjoInW5y",
   "81BYIklAINnH0ZgzD1uJ",
   "9m6aa6kRZybvfNNitV75",
   "ARU8pJldkpMxyN0RsOqW",
   "Eduy992r1bXX4beeWclI",
   "FH4IhZQt2rXEz2DOV5Y9",
   "FrSaAsvf9cuedhbd8PGF",
   "emd9wRhhecY5ZADMy9pO",
   "rfpAMY7l25RxXNV34c1",
   "xgWvXeiMAMgxOnarBLuk",
];

const REAL_SUPPLIER_IDS = [
   "52ekexMU1w4ZaJp4QsFE",
   "A1CVhD84l5ZyJppkpz2Y",
   "CQpIEun0N7VTeZWBFD9t",
   "P9pxU8HYtLQ682a3uZIc",
   "XcGGteJ8r2kocNSqllyz",
   "Y135cAH0s28uqtx6qcRd",
   "azOcTFjIKm7GO813x3Tg",
   "ckif1YqP71F70VKOplGo",
   "fuUQxKfqeGcUR2v2bYdN",
   "gl6awHYY405v4DtAgtCi",
   "tN3wrTazSwtZGmFz0Et9",
   "uNEEdy0jui4uRD38nX3P",
   "zxmTotGD8gzQ9A43YCKW",
];

function getRandomElement<T>(arr: T[]): T {
   return arr[Math.floor(Math.random() * arr.length)];
}

export const stressTestProducts = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { auth, data } = req;

      const uid = auth.uid;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "认证失败。");
      }

      const { count } = data;

      const numToCreate = typeof count === "number" ? Math.floor(count) : 1000;
      if (numToCreate <= 0 || numToCreate > 1000) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            "产品数量必须在1到10000之间。"
         );
      }

      console.log(
         `Starting to generate ${numToCreate} products for user: ${uid}`
      );

      const productsCollectionRef = db
         .collection("users")
         .doc(uid)
         .collection("products");
      const batchLimit = 500;

      const assignments = {
         clients: new Map<string, string[]>(),
         suppliers: new Map<string, string[]>(),
      };

      // create all product documents in batches
      let productBatch = db.batch();
      let operations = 0;

      for (let i = 1; i <= numToCreate; i++) {
         const newProductRef = productsCollectionRef.doc();
         const productId = newProductRef.id;

         const assignedClientId = getRandomElement(REAL_CLIENT_IDS);
         const assignedSupplierId = getRandomElement(REAL_SUPPLIER_IDS);

         if (!assignments.clients.has(assignedClientId))
            assignments.clients.set(assignedClientId, []);
         assignments.clients.get(assignedClientId)!.push(productId);

         if (!assignments.suppliers.has(assignedSupplierId))
            assignments.suppliers.set(assignedSupplierId, []);
         assignments.suppliers.get(assignedSupplierId)!.push(productId);

         const productData = {
            productId: productId,
            productChineseName: `测试产品 ${i} (自动化)`,
            productEnglishName: `Test Product ${i} (Automated)`,
            unitPrice: (Math.random() * 100 + 10).toFixed(2),
            packing: `${Math.floor(Math.random() * 20) + 1} 件`,
            packingMass: {
               packingMassQuantity: `${Math.floor(Math.random() * 500) + 50}`,
               packingMassUnit: "g",
            },
            packingVolume: {
               length: (Math.random() * 0.5 + 0.1).toFixed(2),
               width: (Math.random() * 0.5 + 0.1).toFixed(2),
               height: (Math.random() * 0.5 + 0.1).toFixed(2),
               packingUnit: "m",
            },
            saved: Math.random() > 0.8,
            updatedAt: new Date().toISOString(),
            supplierId: assignedSupplierId,
            additionalNotes: `这是自动化测试产品 #${i}。`,
            clients: [assignedClientId],
            currency: Math.random() > 0.5 ? "¥" : "$",
            hsCode: `HS${Math.floor(100000 + Math.random() * 900000)}`,
            material: ["塑料", "金属", "木材", "纺织品"][
               Math.floor(Math.random() * 4)
            ],
            image: `https://via.placeholder.com/150?text=Product+${i}`,
         };

         productBatch.set(newProductRef, productData);
         operations++;

         if (operations === batchLimit) {
            console.log(`Committing product batch of ${batchLimit}...`);
            await productBatch.commit();
            productBatch = db.batch();
            operations = 0;
         }
      }

      if (operations > 0) {
         console.log(`Committing final product batch of ${operations}...`);
         await productBatch.commit();
      }
      console.log("Product creation complete.");

      console.log("Starting to update client and supplier documents...");

      const updatePromises: Promise<any>[] = [];

      // Update clients
      for (const [clientId, productIds] of assignments.clients.entries()) {
         const clientRef = db
            .collection("users")
            .doc(uid)
            .collection("clients")
            .doc(clientId);
         updatePromises.push(
            clientRef.update({
               productIds: FieldValue.arrayUnion(...productIds),
            })
         );
      }

      // Update suppliers
      for (const [supplierId, productIds] of assignments.suppliers.entries()) {
         const supplierRef = db
            .collection("users")
            .doc(uid)
            .collection("suppliers")
            .doc(supplierId);
         updatePromises.push(
            supplierRef.update({
               productIds: FieldValue.arrayUnion(...productIds),
            })
         );
      }

      await Promise.all(updatePromises);

      console.log(
         `Successfully updated ${assignments.clients.size} clients and ${assignments.suppliers.size} suppliers.`
      );

      return {
         success: true,
      };
   }
);
