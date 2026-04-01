import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from '@/components/ItemCard';
import AddItemModal from '@/components/AddItemModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const AdminItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<'lost' | 'found'>('found');

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Items</h1>
        <div className="flex gap-2">
          <Button onClick={() => { setAddType('lost'); setAddOpen(true); }} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> Add Lost Item
          </Button>
          <Button onClick={() => { setAddType('found'); setAddOpen(true); }} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Add Found Item
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
          ))}
        </div>
      )}

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} type={addType} onSuccess={fetchItems} />
    </div>
  );
};

export default AdminItems;
