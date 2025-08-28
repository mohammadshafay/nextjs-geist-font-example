export interface Bill {
  id: string;
  customerName: string;
  customerId: string;
  amount: number;
  dueDate: string;
  description: string;
  status: "pending" | "paid" | "overdue";
  tallyRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tallyId?: string;
}

export interface TallySync {
  lastSyncDate: string;
  status: "success" | "failed" | "in-progress";
  recordsUpdated: number;
}

export interface User {
  id: string;
  email: string;
  role: "customer" | "admin";
  customerId?: string;
}
