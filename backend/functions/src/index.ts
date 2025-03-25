/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
   admin.initializeApp();
}

import createUserDoc from "./services/users/createUser";
import { createProduct } from "./services/products/createProduct";
import { saveUnsavedProduct } from "./services/products/saveProduct";
export { createUserDoc, createProduct, saveUnsavedProduct };

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
