import { NextResponse } from "next/server";
import { mockCustomers } from "../../../lib/mockBills";

export async function GET() {
  try {
    return NextResponse.json({ customers: mockCustomers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
