import { NextResponse } from "next/server";
import { mockBills, mockCustomers, mockTallySync } from "../../../../lib/mockBills";

export async function POST() {
  try {
    console.log("🔄 Starting Tally synchronization...");
    
    // Update sync status to in-progress
    mockTallySync.status = "in-progress";
    
    // Mock sync delay to simulate real Tally API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate updating bills from Tally
    const updatedCount = Math.floor(Math.random() * 10) + 1;
    
    // Simulate some random updates to bills (mock Tally data changes)
    for (let i = 0; i < Math.min(updatedCount, mockBills.length); i++) {
      const randomBillIndex = Math.floor(Math.random() * mockBills.length);
      mockBills[randomBillIndex].updatedAt = new Date().toISOString();
      
      // Randomly update some bill amounts (simulate Tally corrections)
      if (Math.random() > 0.7) {
        const adjustment = Math.floor(Math.random() * 1000) - 500; // +/- 500
        mockBills[randomBillIndex].amount = Math.max(1000, mockBills[randomBillIndex].amount + adjustment);
      }
    }
    
    // Update sync status to success
    mockTallySync.lastSyncDate = new Date().toISOString();
    mockTallySync.status = "success";
    mockTallySync.recordsUpdated = updatedCount;
    
    console.log(`✅ Tally sync completed successfully!`);
    console.log(`📊 Records updated: ${updatedCount}`);
    console.log(`🕒 Last sync: ${mockTallySync.lastSyncDate}`);
    
    return NextResponse.json({ 
      message: "Tally sync completed successfully", 
      syncInfo: mockTallySync,
      updatedRecords: updatedCount,
      details: {
        totalBills: mockBills.length,
        totalCustomers: mockCustomers.length,
        pendingBills: mockBills.filter(b => b.status === 'pending').length,
        overdueBills: mockBills.filter(b => b.status === 'overdue').length
      }
    });
  } catch (error) {
    console.error('❌ Tally sync failed:', error);
    mockTallySync.status = "failed";
    mockTallySync.lastSyncDate = new Date().toISOString();
    
    return NextResponse.json({ 
      error: "Tally sync failed",
      syncInfo: mockTallySync 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      syncInfo: mockTallySync,
      systemStatus: {
        totalBills: mockBills.length,
        totalCustomers: mockCustomers.length,
        pendingAmount: mockBills
          .filter(b => b.status === 'pending' || b.status === 'overdue')
          .reduce((sum, b) => sum + b.amount, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({ error: "Failed to get sync status" }, { status: 500 });
  }
}
