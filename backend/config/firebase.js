import admin from "firebase-admin";
import fs from "fs";

// Read and parse the JSON manually
const serviceAccount = JSON.parse(
  fs.readFileSync(
    new URL("./socialmediadashboard-34693-firebase-adminsdk-fbsvc-4edb796656.json", import.meta.url)
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
