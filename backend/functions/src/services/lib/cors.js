const admin = require("firebase-admin");

if (!admin.apps.length) {
   admin.initializeApp();
}

const bucket = admin.storage().bucket("fulcrums-ca.firebasestorage.app"); 

// when updating origins get keys from https://console.cloud.google.com/iam-admin/serviceaccounts/details/110898748939604363382/keys?authuser=6&inv=1&invt=AbxlAA&project=fulcrums-ca&supportedpurview=project

(async () => {
   await bucket.setCorsConfiguration([
      {
         origin: ["https://www.fulcrums.ca", "http://localhost:5173"],
         method: ["GET"],
         responseHeader: ["Content-Type"],
         maxAgeSeconds: 3600,
      },
   ]);

   console.log("CORS config set");
})();
