import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ItemCard from '@/components/ItemCard';
import { toast } from 'sonner';

const AdminItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Item deleted'); fetchItems(); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">All Items</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminItems;
