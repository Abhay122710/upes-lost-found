import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from '@/components/ItemCard';
import { toast } from 'sonner';
import { itemService, type Item } from '@/services/itemService';

const MyPosts = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await itemService.getItemsByUser(user.id);
      setItems(data);
    } catch {
      toast.error('Failed to load posts');
    }
    setLoading(false);
  };

  useEffect(() => { fetchMyItems(); }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await itemService.deleteItem(id);
      toast.success('Item deleted');
      fetchMyItems();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">My Posts</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">You haven't posted any items yet.</p>
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

export default MyPosts;
