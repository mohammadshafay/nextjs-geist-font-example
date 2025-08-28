import { NextResponse } from "next/server";
import { mockBills, mockCustomers } from "../../../../lib/mockBills";
import { formatCurrency } from "../../../../lib/utils/currencyUtils";
import { formatDate, getDaysOverdue } from "../../../../lib/utils/dateUtils";

interface NotificationResult {
  billId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: string;
  messageLength: number;
  sent: boolean;
}

export async function POST() {
  try {
    console.log("📱 Starting WhatsApp notification process...");
    
    const pendingBills = mockBills.filter(b => b.status === "pending" || b.status === "overdue");
    
    if (pendingBills.length === 0) {
      return NextResponse.json({ 
        message: "No pending bills found", 
        count: 0,
        bills: []
      });
    }
    
    const notifications: NotificationResult[] = [];
    
    pendingBills.forEach(bill => {
      const customer = mockCustomers.find(c => c.id === bill.customerId);
      
      if (!customer) {
        console.log(`⚠️ Customer not found for bill ${bill.id}`);
        return;
      }
      
      const isOverdue = bill.status === "overdue";
      const daysOverdue = isOverdue ? getDaysOverdue(bill.dueDate) : 0;
      
      // Generate WhatsApp message
      let message = `Dear ${bill.customerName},\n\n`;
      
      if (isOverdue) {
        message += `🔴 OVERDUE PAYMENT REMINDER\n`;
        message += `Your bill is ${daysOverdue} days overdue.\n\n`;
      } else {
        message += `💙 Payment Reminder\n\n`;
      }
      
      message += `Bill Details:\n`;
      message += `📄 Invoice: ${bill.id}\n`;
      message += `💰 Amount: ${formatCurrency(bill.amount)}\n`;
      message += `📅 Due Date: ${formatDate(bill.dueDate)}\n`;
      message += `📝 Description: ${bill.description}\n\n`;
      
      if (isOverdue) {
        message += `⚠️ Please settle this payment immediately to avoid any inconvenience.\n\n`;
      } else {
        message += `Please pay at your earliest convenience.\n\n`;
      }
      
      message += `For any queries, contact us at:\n`;
      message += `📞 +91-9876543200\n`;
      message += `📧 billing@supremehandloom.com\n\n`;
      message += `Thank you for your business!\n`;
      message += `- Supreme Handloom Team`;
      
      // Log the WhatsApp notification (simulate sending)
      console.log(`📱 Sending WhatsApp to ${customer.phone}:`);
      console.log(`   Customer: ${bill.customerName}`);
      console.log(`   Bill: ${bill.id} | Amount: ${formatCurrency(bill.amount)}`);
      console.log(`   Status: ${bill.status.toUpperCase()}`);
      console.log(`   Message Preview: "${message.substring(0, 100)}..."`);
      console.log(`   ✅ Notification queued successfully\n`);
      
      notifications.push({
        billId: bill.id,
        customerName: bill.customerName,
        customerPhone: customer.phone,
        amount: bill.amount,
        status: bill.status,
        messageLength: message.length,
        sent: true
      });
    });
    
    console.log(`✅ WhatsApp notifications sent successfully!`);
    console.log(`📊 Total notifications: ${notifications.length}`);
    console.log(`💰 Total amount notified: ${formatCurrency(notifications.reduce((sum, n) => sum + n.amount, 0))}`);
    
    return NextResponse.json({ 
      message: "Notifications sent successfully", 
      count: notifications.length,
      totalAmount: notifications.reduce((sum, n) => sum + n.amount, 0),
      bills: notifications.map(n => ({ 
        id: n.billId, 
        customerName: n.customerName, 
        amount: n.amount,
        status: n.status
      })),
      details: {
        pendingCount: notifications.filter(n => n.status === 'pending').length,
        overdueCount: notifications.filter(n => n.status === 'overdue').length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Notification process failed:', error);
    return NextResponse.json({ 
      error: "Notification process failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pendingBills = mockBills.filter(b => b.status === "pending" || b.status === "overdue");
    
    return NextResponse.json({
      pendingNotifications: pendingBills.length,
      totalPendingAmount: pendingBills.reduce((sum, bill) => sum + bill.amount, 0),
      breakdown: {
        pending: pendingBills.filter(b => b.status === 'pending').length,
        overdue: pendingBills.filter(b => b.status === 'overdue').length
      }
    });
  } catch (error) {
    console.error('Error fetching notification status:', error);
    return NextResponse.json({ error: "Failed to get notification status" }, { status: 500 });
  }
}
