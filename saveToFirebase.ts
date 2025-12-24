import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export default async function saveToFirebase(prompt: string, result: string) {
  const ref = await addDoc(collection(db, "requests"), {
    prompt,
    result,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

