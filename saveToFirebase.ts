import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function saveTestData() {
  const docRef = await addDoc(collection(db, "test_logs"), {
    message: "Firebase connected successfully",
    createdAt: serverTimestamp(),
    source: "vercel-prod"
  });

  console.log("Saved test doc with ID:", docRef.id);
}
