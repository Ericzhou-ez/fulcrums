import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

const db = admin.firestore();

const createUserDoc = functions.https.onCall(
   async (req: functions.https.CallableRequest) => {
      const { data, auth } = req;

      if (!auth) {
         throw new functions.https.HttpsError("unauthenticated", "你没有权限");
      }

      const { photoUrl, name, email, uid, displayName } = data;

      try {
         const userRef = db.collection("users").doc(uid);
         const userDoc = await userRef.get();

         if (!userDoc.exists) {
            await userRef.set(
               {
                  name: displayName || name || "用户",
                  email: email || "",
                  photo: photoUrl || "",
                  uid: uid,
                  createdAt: new Date().toISOString(),
                  role: "user",
               },
               { merge: true }
            );
         } else {
            return { success: false, message: "用户已存在。" };
         }
         return { success: true, message: "用户文件成功创建。" };
      } catch (err) {
         throw new functions.https.HttpsError(
            "internal",
            "Error in creating user document"
         );
      }
   }
);

export default createUserDoc;
