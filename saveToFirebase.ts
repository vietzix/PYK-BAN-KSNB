// saveToFirebase.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Lưu log chat (prompt + result) vào Firestore collection: "requests"
 * Trả về document id.
 */
export async function saveToFirebase(prompt: string, result: string): Promise<string> {
  const ref = await addDoc(collection(db, "requests"), {
    prompt,
    result,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Export default để bạn có thể import theo cả 2 kiểu:
//  - import saveToFirebase from "../saveToFirebase"
//  - import { saveToFirebase } from "../saveToFirebase"
export default saveToFirebase;
