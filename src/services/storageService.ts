import { supabase } from '@/integrations/supabase/client';
import { API_CONFIG } from './api/config';
import { httpClient } from './api/httpClient';

export const storageService = {
  async uploadItemImage(userId: string, file: File): Promise<string> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      const { url } = await httpClient.uploadFile('/storage/upload', file);
      return url;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('item-images').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('item-images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  async uploadClaimProof(userId: string, file: File): Promise<string> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      const { url } = await httpClient.uploadFile('/storage/upload/proof', file);
      return url;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `claims/${userId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('item-images').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('item-images').getPublicUrl(filePath);
    return data.publicUrl;
  },
};
