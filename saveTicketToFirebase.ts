import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * TicketPayload: cố ý để mở để bạn có thể bổ sung trường về sau mà không cần sửa nhiều.
 * Lưu ý: giá trị phải JSON-serializable (string/number/boolean/null/object/array).
 */
export type TicketPayload = {
  // Mã phiếu hiển thị (vd: TKT-2025-001). Không bắt buộc.
  code?: string;

  title: string;
  field: string;
  status: string;

  unit?: string;
  assignee?: string;
  dueDate?: string;
  reviewProgress?: string;

  // Các trường hay gặp trong form (tuỳ bạn có/không)
  priority?: string;
  project?: string;
  detectDate?: string;
  description?: string;

  // Cho phép thêm trường ngoài danh sách trên
  [key: string]: unknown;
};

/**
 * Lưu 01 phiếu vào collection "tickets".
 * Trả về docId do Firestore cấp.
 */
export async function saveTicketToFirebase(payload: TicketPayload) {
  const docRef = await addDoc(collection(db, "tickets"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
