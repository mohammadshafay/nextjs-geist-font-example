"use client";

import { useState, useEffect } from 'react';
import { Bill } from '@/types/bill';

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/bills');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }
      
      const data = await response.json();
      setBills(data.bills || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const payBill = async (billId: string) => {
    try {
      setError(null);
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billId }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      
      // Update the bill in local state
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === billId 
            ? { ...bill, status: 'paid' as const, updatedAt: new Date().toISOString() }
            : bill
        )
      );

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getBillById = (billId: string): Bill | undefined => {
    return bills.find(bill => bill.id === billId);
  };

  const getPendingBills = (): Bill[] => {
    return bills.filter(bill => bill.status === 'pending');
  };

  const getOverdueBills = (): Bill[] => {
    return bills.filter(bill => bill.status === 'overdue');
  };

  const getPaidBills = (): Bill[] => {
    return bills.filter(bill => bill.status === 'paid');
  };

  const getTotalAmount = (): number => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const getPendingAmount = (): number => {
    return bills
      .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
      .reduce((total, bill) => total + bill.amount, 0);
  };

  const getCustomerBills = (customerId: string): Bill[] => {
    return bills.filter(bill => bill.customerId === customerId);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return {
    bills,
    loading,
    error,
    fetchBills,
    payBill,
    getBillById,
    getPendingBills,
    getOverdueBills,
    getPaidBills,
    getTotalAmount,
    getPendingAmount,
    getCustomerBills,
  };
};
