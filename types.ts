
export enum TicketStatus {
  NEW = 'Mới',
  IN_PROGRESS = 'Đang xử lý',
  PENDING_REVIEW = 'Đang rà soát',
  FOLLOW_UP = 'Đang theo dõi',
  OVERDUE = 'Quá hạn',
  COMPLETED = 'Hoàn thành'
}

export enum Priority {
  LOW = 'Thấp',
  MEDIUM = 'Trung bình',
  HIGH = 'Cao/Khẩn cấp'
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  status: 'pending' | 'completed';
  comment?: string;
  attachment?: string;
  legalBasis?: string;
}

export interface CommonError {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  severity: 'warning' | 'critical';
}

export interface TicketTask {
  id: string;
  name: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'completed';
  evidence?: string;
}

export interface Ticket {
  id: string;
  title: string;
  field: string;
  project: string;
  unit: string;
  status: TicketStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
  lastUpdated: string;
  description?: string;
  createdAt: string;
  reviewProgress: number;
}
