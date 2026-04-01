import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from '@/components/ItemCard';
import AddItemModal from '@/components/AddItemModal';
import ClaimModal from '@/components/ClaimModal';
import DeleteWithReasonDialog from '@/components/DeleteWithReasonDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const AdminItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<'lost' | 'found'>('found');
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [claimItem, setClaimItem] = useState<any>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdminDelete = async (reason: string) => {
    if (!deleteItem || !user) return;
    setDeleteLoading(true);

    // Store in deleted_items first
    const { error: insertError } = await supabase.from('deleted_items').insert({
      original_item_id: deleteItem.id,
      title: deleteItem.title,
      description: deleteItem.description,
      category: deleteItem.category,
      location: deleteItem.location,
      date: deleteItem.date,
      type: deleteItem.type,
      image_url: deleteItem.image_url,
      status: deleteItem.status,
      original_user_id: deleteItem.user_id,
      deleted_by: user.id,
      deletion_reason: reason,
    });

    if (insertError) {
      toast.error('Failed to archive item');
      setDeleteLoading(false);
      return;
    }

    // Then delete the original
    const { error } = await supabase.from('items').delete().eq('id', deleteItem.id);
    if (error) {
      toast.error('Failed to delete item');
    } else {
      toast.success('Item deleted and archived');
      fetchItems();
    }
    setDeleteLoading(false);
    setDeleteItem(null);
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
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              showAdminX
              onAdminDelete={() => setDeleteItem(item)}
              onClaim={item.status === 'active' ? () => setClaimItem(item) : undefined}
            />
          ))}
        </div>
      )}

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} type={addType} onSuccess={fetchItems} />
      {deleteItem && (
        <DeleteWithReasonDialog
          open={!!deleteItem}
          itemTitle={deleteItem.title}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleAdminDelete}
          loading={deleteLoading}
        />
      )}
      {claimItem && <ClaimModal item={claimItem} onClose={() => setClaimItem(null)} onSuccess={fetchItems} />}
    </div>
  );
};

export default AdminItems;
