// User
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  avatar?: string | null;
  isActive: boolean;
  companyId?: string | null;
  createdAt: string;
}

// CRM
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  companyId: string;
  ownerId?: string | null;
  owner?: { id: string; firstName?: string | null; lastName?: string | null; email: string } | null;
  source?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  closeDate?: string | null;
  contactId?: string | null;
  contact?: { id: string; firstName: string; lastName: string } | null;
  companyId: string;
  ownerId?: string | null;
  owner?: { id: string; firstName?: string | null; lastName?: string | null; email: string } | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DealStage = 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export const DEAL_STAGES: DealStage[] = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  LEAD: 'Lead', QUALIFIED: 'Qualified', PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation', CLOSED_WON: 'Closed Won', CLOSED_LOST: 'Closed Lost',
};

// Sales
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  price: number;
  cost: number;
  unit: string;
  category?: string | null;
  stockQty: number;
  minStockQty: number;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string | null;
  companyId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  ownerId?: string | null;
  owner?: { id: string; firstName?: string | null; lastName?: string | null } | null;
  items?: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId?: string | null;
  product?: Product | null;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: 'Draft', SENT: 'Sent', PAID: 'Paid', OVERDUE: 'Overdue', CANCELLED: 'Cancelled',
};

// HR
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  salary?: number | null;
  hireDate?: string | null;
  departmentId?: string | null;
  department?: { id: string; name: string } | null;
  companyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
  _count?: { employees: number };
}

// Projects
export interface Project {
  id: string;
  name: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  status: string;
  companyId: string;
  ownerId?: string | null;
  owner?: { id: string; firstName?: string | null; lastName?: string | null } | null;
  _count?: { tasks: number };
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  projectId: string;
  assigneeId?: string | null;
  assignee?: { id: string; firstName?: string | null; lastName?: string | null } | null;
  creatorId?: string | null;
  creator?: { id: string; firstName?: string | null; lastName?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', REVIEW: 'Review', DONE: 'Done',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent',
};

// Dashboard
export interface DashboardStats {
  contactsCount: number;
  dealsCount: number;
  dealsWon: number;
  pipelineValue: number;
  productsCount: number;
  invoicesCount: number;
  revenue: number;
  invoicesOverdue: number;
  employeesCount: number;
  projectsCount: number;
  activeProjects: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
