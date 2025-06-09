import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { db } from "../../utils";

/**
 * A callable function to atomically add and/or remove product IDs from a client's
 * `productIds` array.
 *
 * @param {object} data The data passed to the function.
 * @param {string} data.clientId The ID of the client document to update.
 * @param {string[]} [data.productIdsToAdd] An optional array of product IDs to add.
 * @param {string[]} [data.productIdsToRemove] An optional array of product IDs to remove.
 * @param {functions.https.CallableContext} context The context of the call, including auth info.
 * @returns {Promise<{success: boolean, clientId: string}>} A promise that resolves with a success status.
 */
export const updateClientProducts = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { data, auth } = req;

      if (!auth) {
         throw new functions.https.HttpsError(
            "unauthenticated",
            "该操作需要认证。"
         );
      }

      const uid = auth.uid;

      const { clientId, productIdsToAdd, productIdsToRemove } = data;

      if (typeof clientId !== "string" || clientId.trim().length === 0) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            "必须提供有效的客户ID。"
         );
      }

      if (
         (productIdsToAdd && !Array.isArray(productIdsToAdd)) ||
         (productIdsToRemove && !Array.isArray(productIdsToRemove))
      ) {
         throw new functions.https.HttpsError(
            "invalid-argument",
            "要添加或删除的产品ID必须是数组格式。"
         );
      }

      const toAdd = productIdsToAdd || [];
      const toRemove = productIdsToRemove || [];

      if (toAdd.length === 0 && toRemove.length === 0) {
         console.log("No products to add or remove. Exiting successfully.");
         return { success: true, message: "No changes were needed." };
      }

      const clientRef = db
         .collection("users")
         .doc(uid)
         .collection("clients")
         .doc(clientId);

      try {
         const clientDoc = await clientRef.get();
         if (!clientDoc.exists) {
            throw new functions.https.HttpsError(
               "not-found",
               `未找到ID为 ${clientId} 的客户。`
            );
         }

         // remove the specified product IDs.
         if (toRemove.length > 0) {
            await clientRef.update({
               productIds: admin.firestore.FieldValue.arrayRemove(...toRemove),
            });
         }

         // add the new product IDs. arrayUnion automatically handles duplicates.
         if (toAdd.length > 0) {
            await clientRef.update({
               productIds: admin.firestore.FieldValue.arrayUnion(...toAdd),
            });
         }

         // update the timestamp to reflect this modification.
         await clientRef.update({
            updatedAt: new Date().toISOString(),
         });

         return { success: true, clientId: clientId };
      } catch (error) {
         
         console.error("Error updating client products:", error);

         if (error instanceof functions.https.HttpsError) {
            throw error;
         }

         throw new functions.https.HttpsError(
            "internal",
            "更新客户产品时发生未知错误。",
            error
         );
      }
   }
);
