// saveToFirebase.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; // firebase.ts phải export db

export async function saveToFirebase(prompt: string, result: string) {
  const ref = await addDoc(collection(db, "requests"), {
    prompt,
    result,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export default saveToFirebase;

