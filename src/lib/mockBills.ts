import { Bill, Customer, TallySync } from "../types/bill";

export const mockCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "Rajesh Textiles Ltd",
    email: "rajesh@textiles.com",
    phone: "+91-9876543210",
    address: "Mumbai, Maharashtra",
    tallyId: "TALLY_001"
  },
  {
    id: "cust_002", 
    name: "Priya Fashion House",
    email: "priya@fashion.com",
    phone: "+91-9876543211",
    address: "Delhi, India",
    tallyId: "TALLY_002"
  },
  {
    id: "cust_003",
    name: "Silk Emporium",
    email: "contact@silkemporium.com",
    phone: "+91-9876543212",
    address: "Bangalore, Karnataka",
    tallyId: "TALLY_003"
  },
  {
    id: "cust_004",
    name: "Heritage Handlooms",
    email: "info@heritagehandlooms.com",
    phone: "+91-9876543213",
    address: "Chennai, Tamil Nadu",
    tallyId: "TALLY_004"
  }
];

export const mockBills: Bill[] = [
  {
    id: "INV_001",
    customerName: "Rajesh Textiles Ltd",
    customerId: "cust_001",
    amount: 15000,
    dueDate: "2024-01-15",
    description: "Premium Handloom Sarees - 10 pieces",
    status: "pending",
    tallyRef: "TALLY_INV_001",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-01T10:00:00Z"
  },
  {
    id: "INV_002",
    customerName: "Priya Fashion House", 
    customerId: "cust_002",
    amount: 23000,
    dueDate: "2024-01-10",
    description: "Handloom Fabric Bulk Order - 50 meters",
    status: "overdue",
    tallyRef: "TALLY_INV_002",
    createdAt: "2023-11-15T14:30:00Z",
    updatedAt: "2023-12-01T09:15:00Z"
  },
  {
    id: "INV_003",
    customerName: "Silk Emporium",
    customerId: "cust_003",
    amount: 8500,
    dueDate: "2024-01-20",
    description: "Silk Handloom Scarves - 25 pieces",
    status: "pending",
    tallyRef: "TALLY_INV_003",
    createdAt: "2023-12-05T15:20:00Z",
    updatedAt: "2023-12-05T15:20:00Z"
  },
  {
    id: "INV_004",
    customerName: "Heritage Handlooms",
    customerId: "cust_004",
    amount: 32000,
    dueDate: "2023-12-25",
    description: "Traditional Handloom Bedsheets - 40 sets",
    status: "overdue",
    tallyRef: "TALLY_INV_004",
    createdAt: "2023-11-20T11:45:00Z",
    updatedAt: "2023-12-01T08:30:00Z"
  },
  {
    id: "INV_005",
    customerName: "Rajesh Textiles Ltd",
    customerId: "cust_001",
    amount: 12000,
    dueDate: "2024-02-01",
    description: "Cotton Handloom Towels - 60 pieces",
    status: "paid",
    tallyRef: "TALLY_INV_005",
    createdAt: "2023-12-10T09:30:00Z",
    updatedAt: "2023-12-15T14:20:00Z"
  }
];

export let mockTallySync: TallySync = {
  lastSyncDate: "2024-01-01T08:00:00Z",
  status: "success",
  recordsUpdated: 25
};

// Mock users for authentication
export const mockUsers = [
  {
    id: "user_001",
    email: "rajesh@textiles.com",
    role: "customer" as const,
    customerId: "cust_001"
  },
  {
    id: "user_002", 
    email: "priya@fashion.com",
    role: "customer" as const,
    customerId: "cust_002"
  },
  {
    id: "admin_001",
    email: "admin@supremehandloom.com",
    role: "admin" as const
  }
];
