import { supabase } from '@/integrations/supabase/client';
import { API_CONFIG } from './api/config';
import { httpClient } from './api/httpClient';

export interface DashboardStats {
  lost: number;
  found: number;
  claims: number;
  resolved: number;
}

export interface AdminStats {
  total: number;
  lost: number;
  found: number;
  pendingClaims: number;
}

export const statsService = {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.get<DashboardStats>('/stats/dashboard', { userId });
    }

    const [lost, found, claims, resolved] = await Promise.all([
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'lost'),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'found'),
      supabase.from('claims').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('status', 'resolved'),
    ]);
    return {
      lost: lost.count || 0,
      found: found.count || 0,
      claims: claims.count || 0,
      resolved: resolved.count || 0,
    };
  },

  async getAdminStats(): Promise<AdminStats> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.get<AdminStats>('/stats/admin');
    }

    const [total, lost, found, pending] = await Promise.all([
      supabase.from('items').select('id', { count: 'exact', head: true }),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'lost'),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'found'),
      supabase.from('claims').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);
    return {
      total: total.count || 0,
      lost: lost.count || 0,
      found: found.count || 0,
      pendingClaims: pending.count || 0,
    };
  },
};
