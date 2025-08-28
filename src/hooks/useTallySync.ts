"use client";

import { useState, useEffect } from 'react';
import { TallySync } from '@/types/bill';

export const useTallySync = () => {
  const [syncInfo, setSyncInfo] = useState<TallySync | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSyncStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/tally-sync');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sync status');
      }
      
      const data = await response.json();
      setSyncInfo(data.syncInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      // Update sync status to in-progress
      setSyncInfo(prev => prev ? { ...prev, status: 'in-progress' } : null);
      
      const response = await fetch('/api/admin/tally-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const data = await response.json();
      setSyncInfo(data.syncInfo);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMessage);
      
      // Update sync status to failed
      setSyncInfo(prev => prev ? { ...prev, status: 'failed' } : null);
      
      throw new Error(errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  const getLastSyncTime = (): string => {
    if (!syncInfo?.lastSyncDate) return 'Never';
    
    const lastSync = new Date(syncInfo.lastSyncDate);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getSyncStatusColor = (): string => {
    if (!syncInfo) return 'gray';
    
    switch (syncInfo.status) {
      case 'success':
        return 'green';
      case 'failed':
        return 'red';
      case 'in-progress':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getSyncStatusText = (): string => {
    if (!syncInfo) return 'Unknown';
    
    switch (syncInfo.status) {
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  const isSyncNeeded = (): boolean => {
    if (!syncInfo?.lastSyncDate) return true;
    
    const lastSync = new Date(syncInfo.lastSyncDate);
    const now = new Date();
    const diffInHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    // Consider sync needed if last sync was more than 4 hours ago
    return diffInHours > 4;
  };

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  return {
    syncInfo,
    loading,
    syncing,
    error,
    fetchSyncStatus,
    triggerSync,
    getLastSyncTime,
    getSyncStatusColor,
    getSyncStatusText,
    isSyncNeeded,
  };
};
