import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig.json";
import { getDatabase } from "firebase/database";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export { auth, db };
