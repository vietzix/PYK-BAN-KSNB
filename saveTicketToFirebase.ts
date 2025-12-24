import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export type TicketPayload = {
  id?: string;
  title: string;
  field: string;
  unit?: string;
  assignee?: string;
  status: string;
  dueDate?: string;
  reviewProgress?: string;
};

export async function saveTicketToFirebase(payload: TicketPayload) {
  // Lưu vào collection "tickets"
  const docRef = await addDoc(collection(db, "tickets"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return docRef.id; // id do Firestore cấp
}
