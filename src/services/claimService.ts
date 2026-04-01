import { supabase } from '@/integrations/supabase/client';
import { API_CONFIG } from './api/config';
import { httpClient } from './api/httpClient';

export interface Claim {
  id: string;
  item_id: string;
  user_id: string;
  description: string;
  proof_image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  items?: { title: string; image_url: string | null; location: string } | null;
  profile?: { name: string; sap_id: string } | null;
}

export interface CreateClaimData {
  item_id: string;
  user_id: string;
  description: string;
  proof_image_url: string | null;
}

export const claimService = {
  async getClaimsByUser(userId: string): Promise<Claim[]> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.get<Claim[]>('/claims', { userId });
    }

    const { data, error } = await supabase
      .from('claims')
      .select('*, items(title, image_url, location)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Claim[];
  },

  async getAllClaims(): Promise<Claim[]> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.get<Claim[]>('/claims');
    }

    const { data: claimsData, error } = await supabase
      .from('claims')
      .select('*, items(title, image_url, location)')
      .order('created_at', { ascending: false });
    if (error) throw error;

    if (claimsData && claimsData.length > 0) {
      const userIds = [...new Set(claimsData.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name, sap_id')
        .in('user_id', userIds);

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      return claimsData.map(c => ({ ...c, profile: profileMap.get(c.user_id) || null })) as Claim[];
    }
    return [];
  },

  async createClaim(claim: CreateClaimData): Promise<void> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      await httpClient.post('/claims', claim);
      return;
    }

    const { error } = await supabase.from('claims').insert(claim);
    if (error) throw error;
  },

  async updateClaimStatus(id: string, status: 'approved' | 'rejected', itemId?: string): Promise<void> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      await httpClient.put(`/claims/${id}/status`, { status, itemId });
      return;
    }

    const { error } = await supabase.from('claims').update({ status }).eq('id', id);
    if (error) throw error;
    if (status === 'approved' && itemId) {
      await supabase.from('items').update({ status: 'claimed' }).eq('id', itemId);
    }
  },
};
