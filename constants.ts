
import { Ticket, TicketStatus, Priority } from './types';

export const UNITS = ['Ban Tài chính', 'Ban Kế toán', 'Ban KSNB', 'Ban Mua sắm', 'VP Tập đoàn', 'Ban Dự án'];
export const FIELDS = ['Kế toán', 'Kiểm soát', 'Vận hành', 'Quản trị', 'Pháp lý', 'Nhân sự'];
export const PROJECTS = ['Dự án X', 'Lô B - Khu Đô Thị', 'VP Tập đoàn', 'Toàn công ty', 'Nhà máy 1'];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-2025-001',
    title: 'Sai lệch số lượng hàng tồn kho kho A',
    field: 'Kế toán',
    project: 'Dự án X',
    unit: 'Ban Tài chính',
    status: TicketStatus.NEW,
    priority: Priority.HIGH,
    assignee: 'Nguyễn Văn Điều',
    dueDate: '2025-11-15',
    lastUpdated: '2025-10-15',
    createdAt: '2025-10-15',
    reviewProgress: 10
  },
  {
    id: 'TKT-2025-002',
    title: 'Thiếu chứng từ thanh toán đợt 2',
    field: 'Kiểm soát',
    project: 'Lô B - Khu Đô Thị',
    unit: 'Ban KSNB',
    status: TicketStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    assignee: 'Giang Anh Dũng',
    dueDate: '2025-11-12',
    lastUpdated: '2025-10-16',
    createdAt: '2025-10-10',
    reviewProgress: 45
  },
  {
    id: 'TKT-2025-005',
    title: 'Vi phạm quy trình mua sắm thiết bị IT',
    field: 'Vận hành',
    project: 'VP Tập đoàn',
    unit: 'Ban Mua sắm',
    status: TicketStatus.OVERDUE,
    priority: Priority.HIGH,
    assignee: 'Ngô Thị Tuấn Anh',
    dueDate: '2025-11-01',
    lastUpdated: '2025-10-30',
    createdAt: '2025-10-01',
    reviewProgress: 20
  }
];

// Helper functions to manage tickets in localStorage
export const getTickets = (): Ticket[] => {
  const stored = localStorage.getItem('audit_portal_tickets');
  if (!stored) {
    localStorage.setItem('audit_portal_tickets', JSON.stringify(INITIAL_TICKETS));
    return INITIAL_TICKETS;
  }
  return JSON.parse(stored);
};

export const addTicketToStore = (ticket: Ticket) => {
  const tickets = getTickets();
  localStorage.setItem('audit_portal_tickets', JSON.stringify([ticket, ...tickets]));
};

export const COMMON_ERRORS_MOCK = [
  { id: '1', title: 'Thiếu chữ ký phê duyệt', description: 'Phiếu không có chữ ký của cấp quản lý trực tiếp.', recommendation: 'Yêu cầu bổ sung chữ ký trước khi xử lý.', severity: 'critical' },
  { id: '2', title: 'Sai lệch số tiền > 5%', description: 'Số tiền trên phiếu chênh lệch quá 5% so với hóa đơn gốc.', recommendation: 'Kiểm tra lại tỷ giá hoặc các khoản phí phụ thu.', severity: 'warning' }
];

export const CHECKLIST_STEPS_MOCK = [
  { id: '1', title: 'Tiếp nhận & sàng lọc', status: 'completed' },
  { id: '2', title: 'Rà soát thẩm quyền', status: 'completed' },
  { id: '3', title: 'Rà soát nội dung', status: 'active' },
  { id: '4', title: 'Kết luận/ý kiến', status: 'pending' },
  { id: '5', title: 'Theo dõi thực hiện', status: 'pending' }
];
