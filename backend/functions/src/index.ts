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

// user services
import createUserDoc from "./services/users/createUser";

// product services
import { createProduct } from "./services/products/createProduct";
import { editProduct } from "./services/products/editProduct";
import { saveUnsavedProduct } from "./services/products/saveProduct";
import { deleteProducts } from "./services/products/deleteProduct";

// client services
import { addClient } from "./services/client/addClient";
import { editClient } from "./services/client/editClient";
import { deleteClient } from "./services/client/deleteClient";
import { updateClientProducts } from "./services/client/editProductIds";

//suplier services
import { addSupplier } from "./services/supplier/addSupplier";
import { editSupplier } from "./services/supplier/editSupplier";
import { deleteSupplier } from "./services/supplier/deleteSupplier";

import { syncAll } from "./services/syncAll";
import { stressTestProducts } from "./services/stressTest";

export {
   createUserDoc,
   createProduct,
   saveUnsavedProduct,
   editProduct,
   deleteProducts,
   addClient,
   editClient,
   deleteClient,
   addSupplier,
   editSupplier,
   deleteSupplier,
   syncAll,
   updateClientProducts,
   stressTestProducts,
};

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
