# Detailed Implementation Plan for Supreme Handloom B2B Creditors Demo App

## 1. Data Modeling and Mock Data
- **File:** `src/types/bill.ts`  
  - Create a TypeScript interface for a bill:  
    ```typescript
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
    ```
- **File:** `src/lib/mockBills.ts`  
  - Export an array of mock bills and customers using the defined interfaces:  
    ```typescript
    import { Bill, Customer } from "../types/bill";

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
      }
    ];

    export const mockTallySync: TallySync = {
      lastSyncDate: "2024-01-01T08:00:00Z",
      status: "success",
      recordsUpdated: 25
    };
    ```

## 2. API Endpoints
- **File:** `src/app/api/bills/route.ts`  
  - Implement a GET method to return all bills and a POST method to update a bill's status to "paid".  
  - Include try/catch blocks for error handling.
  - Example snippet:
    ```typescript
    import { NextResponse } from "next/server";
    import { mockBills } from "../../../lib/mockBills";

    export async function GET() {
      try {
        return NextResponse.json({ bills: mockBills });
      } catch (error) {
        return NextResponse.error();
      }
    }

    export async function POST(request: Request) {
      try {
        const { billId } = await request.json();
        const billIndex = mockBills.findIndex(b => b.id === billId);
        if (billIndex === -1) {
          return NextResponse.json({ error: "Bill not found" }, { status: 404 });
        }
        mockBills[billIndex].status = "paid";
        mockBills[billIndex].updatedAt = new Date().toISOString();
        return NextResponse.json({ message: "Payment successful", bill: mockBills[billIndex] });
      } catch (error) {
        return NextResponse.json({ error: "Payment failed" }, { status: 500 });
      }
    }
    ```

- **File:** `src/app/api/admin/tally-sync/route.ts`  
  - Implement Tally synchronization endpoint for admin use:
    ```typescript
    import { NextResponse } from "next/server";
    import { mockBills, mockCustomers, mockTallySync } from "../../../../lib/mockBills";

    export async function POST() {
      try {
        // Simulate Tally sync process
        console.log("Starting Tally synchronization...");
        
        // Mock sync delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate updating bills from Tally
        const updatedCount = Math.floor(Math.random() * 10) + 1;
        
        // Update sync status
        mockTallySync.lastSyncDate = new Date().toISOString();
        mockTallySync.status = "success";
        mockTallySync.recordsUpdated = updatedCount;
        
        console.log(`Tally sync completed. ${updatedCount} records updated.`);
        
        return NextResponse.json({ 
          message: "Tally sync completed successfully", 
          syncInfo: mockTallySync,
          updatedRecords: updatedCount
        });
      } catch (error) {
        mockTallySync.status = "failed";
        return NextResponse.json({ error: "Tally sync failed" }, { status: 500 });
      }
    }

    export async function GET() {
      try {
        return NextResponse.json({ syncInfo: mockTallySync });
      } catch (error) {
        return NextResponse.json({ error: "Failed to get sync status" }, { status: 500 });
      }
    }
    ```

- **File:** `src/app/api/customers/route.ts`  
  - Implement customer management endpoints:
    ```typescript
    import { NextResponse } from "next/server";
    import { mockCustomers } from "../../../lib/mockBills";

    export async function GET() {
      try {
        return NextResponse.json({ customers: mockCustomers });
      } catch (error) {
        return NextResponse.error();
      }
    }
    ```

- **File:** `src/app/api/notifications/trigger/route.ts`  
  - Simulate sending payment notifications (e.g., via WhatsApp) for each pending bill.  
  - Log the messaging simulation and return a success JSON response.
    ```typescript
    import { NextResponse } from "next/server";
    import { mockBills, mockCustomers } from "../../../../lib/mockBills";

    export async function POST() {
      try {
        const pendingBills = mockBills.filter(b => b.status === "pending" || b.status === "overdue");
        
        pendingBills.forEach(bill => {
          const customer = mockCustomers.find(c => c.id === bill.customerId);
          console.log(`📱 Sending WhatsApp reminder to ${customer?.phone}:`);
          console.log(`   Bill: ${bill.id} | Amount: ₹${bill.amount} | Due: ${bill.dueDate}`);
          console.log(`   Customer: ${bill.customerName}`);
          console.log(`   Message: "Dear ${bill.customerName}, your bill ${bill.id} of ₹${bill.amount} is ${bill.status}. Please pay at your earliest convenience."`);
        });
        
        return NextResponse.json({ 
          message: "Notifications sent successfully", 
          count: pendingBills.length,
          bills: pendingBills.map(b => ({ id: b.id, customerName: b.customerName, amount: b.amount }))
        });
      } catch (error) {
        return NextResponse.json({ error: "Notification process failed" }, { status: 500 });
      }
    }
    ```

## 3. Frontend Pages and UI Components
- **Login Page**  
  - **File:** `src/app/login/page.tsx`  
    - Create a centered login form with email and password fields, error validations, and a submit handler that redirects to the appropriate dashboard (customer or admin).
    - Use modern typography, spacing, and a subtle shadow for the card.
    - Include role selection (Customer/Admin) in login form.

- **Customer Dashboard Page**  
  - **File:** `src/app/dashboard/page.tsx`  
    - Create a page that fetches bills (via `/api/bills`), displays them in a responsive table with clear headings and spacing.
    - Include a "Pay Now" button (navigating to `/payment/[billId]`) for pending bills.
    - Show bill status with color coding (pending: yellow, overdue: red, paid: green).
    - Handle loading states and errors gracefully.

- **Admin Dashboard Page**  
  - **File:** `src/app/admin/page.tsx`  
    - Create an admin dashboard with:
      - Overview cards showing total pending bills, overdue bills, total amount due
      - Tally sync status and last sync date
      - "Sync with Tally" button that calls `/api/admin/tally-sync`
      - "Send Payment Reminders" button that calls `/api/notifications/trigger`
      - Customer list with their pending bill counts
      - Recent activity log
    - Include loading states for sync operations

- **Tally Sync Management Page**  
  - **File:** `src/app/admin/tally-sync/page.tsx`  
    - Dedicated page for Tally synchronization management
    - Display sync history, status, and detailed logs
    - Manual sync trigger with progress indicator
    - Sync configuration options (mock)

- **Payment Page**  
  - **File:** `src/app/payment/[billId]/page.tsx`  
    - Create a dynamic route page that fetches a single bill detail.
    - Display comprehensive bill information including customer details, due date, description
    - "Pay Now" button which triggers a POST call to `/api/bills` to simulate payment.
    - Show success messages and automatically redirect back to the dashboard.
    - Include payment method selection (mock)

## 4. Navigation and Layout Components
- **File:** `src/components/ui/navigation.tsx`  
  - Create a navigation component with role-based menu items
  - Customer navigation: Dashboard, Profile, Logout
  - Admin navigation: Dashboard, Tally Sync, Customers, Notifications, Logout

- **File:** `src/app/layout.tsx`  
  - Update root layout to include navigation and proper styling
  - Add role-based conditional rendering for navigation

## 5. Global Styling Enhancements
- **File:** `src/app/globals.css` (DO NOT MODIFY - as per instructions)
  - Use Tailwind classes for all styling instead of modifying globals.css
  - Focus on utility classes for modern, clean UI design

## 6. Error Handling and Testing
- Each API endpoint uses try/catch blocks and returns appropriate HTTP status codes.
- Client components check response states to display loading messages or error alerts.
- Test endpoints via curl commands to verify JSON responses and error messages.
- Test Tally sync functionality and notification system.

## 7. Additional Features
- **File:** `src/lib/utils/dateUtils.ts`  
  - Utility functions for date formatting and overdue calculation
- **File:** `src/lib/utils/currencyUtils.ts`  
  - Currency formatting utilities for Indian Rupees
- **File:** `src/hooks/useBills.ts`  
  - Custom hook for bill management and state
- **File:** `src/hooks/useTallySync.ts`  
  - Custom hook for Tally synchronization status

## Summary
- Enhanced data model with customer management and Tally integration
- Added comprehensive admin dashboard with Tally sync functionality  
- Implemented role-based access (Customer vs Admin views)
- Created Tally synchronization simulation with status tracking
- Enhanced notification system with customer contact details
- Built responsive UI with proper error handling and loading states
- Integrated bill status management with color coding
- Added utility functions for date and currency formatting
- Demonstrated complete B2B creditors management system with admin controls

After the plan approval, I will breakdown the plan into logical steps and create a tracker (TODO.md) to track the execution of steps in the plan. I will overwrite this file every time to update the completed steps.
