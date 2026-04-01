import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from '@/components/ItemCard';
import AddItemModal from '@/components/AddItemModal';
import ClaimModal from '@/components/ClaimModal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ItemsPageProps {
  type: 'lost' | 'found';
}

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'ID Cards', 'Keys', 'Bags', 'Others'];
const LOCATIONS = ['Library', 'Hostel', 'Cafeteria', 'Main Building', 'Sports Complex', 'Parking', 'Lab', 'Auditorium'];

const ItemsPage = ({ type }: ItemsPageProps) => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [claimItem, setClaimItem] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase.from('items').select('*, profiles(name, sap_id)').eq('type', type).order('created_at', { ascending: false });
    if (filterCategory !== 'all') query = query.eq('category', filterCategory);
    if (filterLocation !== 'all') query = query.eq('location', filterLocation);
    const { data } = await query;
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [type, filterCategory, filterLocation]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground capitalize">{type} Items</h1>
        <Button onClick={() => setAddOpen(true)} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Report {type === 'lost' ? 'Lost' : 'Found'} Item
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No {type} items yet. Be the first to report!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onClaim={type === 'found' ? () => setClaimItem(item) : undefined}
            />
          ))}
        </div>
      )}

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} type={type} onSuccess={fetchItems} />
      {claimItem && <ClaimModal item={claimItem} onClose={() => setClaimItem(null)} onSuccess={fetchItems} />}
    </div>
  );
};

export default ItemsPage;
