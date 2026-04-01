import { supabase } from '@/integrations/supabase/client';
import { API_CONFIG } from './api/config';
import { httpClient } from './api/httpClient';

export interface Item {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemFilters {
  type?: 'lost' | 'found';
  category?: string;
  location?: string;
}

export interface CreateItemData {
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  image_url: string | null;
}

export const itemService = {
  async getItems(filters: ItemFilters = {}): Promise<Item[]> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      const params: Record<string, string> = {};
      if (filters.type) params.type = filters.type;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.location && filters.location !== 'all') params.location = filters.location;
      return httpClient.get<Item[]>('/items', params);
    }

    let query = supabase.from('items').select('*').order('created_at', { ascending: false });
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
    if (filters.location && filters.location !== 'all') query = query.eq('location', filters.location);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Item[];
  },

  async getItemById(id: string): Promise<Item | null> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.get<Item>(`/items/${id}`);
    }

    const { data, error } = await supabase.from('items').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data as Item | null;
  },

  async getItemsByUser(userId: string): Promise<Item[]> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.get<Item[]>('/items', { userId });
    }

    const { data, error } = await supabase.from('items').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Item[];
  },

  async createItem(item: CreateItemData): Promise<Item> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.post<Item>('/items', item);
    }

    const { data, error } = await supabase.from('items').insert(item).select().single();
    if (error) throw error;
    return data as Item;
  },

  async deleteItem(id: string): Promise<void> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.delete(`/items/${id}`);
    }

    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) throw error;
  },

  async updateItemStatus(id: string, status: string): Promise<void> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      await httpClient.put(`/items/${id}/status`, { status });
      return;
    }

    const { error } = await supabase.from('items').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async archiveAndDelete(item: Item, deletedBy: string, reason: string): Promise<void> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      await httpClient.post(`/items/${item.id}/archive`, { reason });
      return;
    }

    const { error: insertError } = await supabase.from('deleted_items').insert({
      original_item_id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      type: item.type,
      image_url: item.image_url,
      status: item.status,
      original_user_id: item.user_id,
      deleted_by: deletedBy,
      deletion_reason: reason,
    });
    if (insertError) throw insertError;

    const { error } = await supabase.from('items').delete().eq('id', item.id);
    if (error) throw error;
  },

  async getDeletedItems(): Promise<any[]> {
    if (API_CONFIG.USE_SPRING_BOOT) {
      return httpClient.get('/items/deleted');
    }

    const { data, error } = await supabase.from('deleted_items').select('*').order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
