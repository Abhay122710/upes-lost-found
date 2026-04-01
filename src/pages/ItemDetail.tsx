import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ClaimModal from '@/components/ClaimModal';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, MapPin, Calendar, Tag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { itemService, type Item } from '@/services/itemService';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimOpen, setClaimOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const data = await itemService.getItemById(id);
      setItem(data);
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-72 bg-muted rounded-2xl" />
        <div className="h-4 w-full bg-muted rounded" />
      </div>
    );
  }

  if (!item) {
    return <div className="text-center py-20 text-muted-foreground">Item not found.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-80 object-cover rounded-2xl border border-border/50" />
          ) : (
            <div className="w-full h-80 bg-muted flex items-center justify-center rounded-2xl">
              <span className="text-6xl">📦</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              item.type === 'lost' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'
            }`}>
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">{item.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{item.location}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(item.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" />{item.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-lg ${
              item.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-accent/20 text-accent-foreground'
            }`}>{item.status}</span>
          </div>

          {item.type === 'found' && item.status === 'active' && user?.id !== item.user_id && (
            <Button onClick={() => setClaimOpen(true)} className="gradient-primary text-primary-foreground mt-4" size="lg">
              Claim This Item
            </Button>
          )}

          {(isAdmin || user?.id === item.user_id) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-4 gap-2" size="lg">
                  <Trash2 className="w-4 h-4" /> Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{item.title}"?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. The item will be permanently removed.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={async () => {
                      try {
                        await itemService.deleteItem(item.id);
                        toast.success('Item deleted');
                        navigate(-1);
                      } catch {
                        toast.error('Failed to delete');
                      }
                    }}
                  >Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {claimOpen && <ClaimModal item={item} onClose={() => setClaimOpen(false)} onSuccess={() => { setClaimOpen(false); }} />}
    </motion.div>
  );
};

export default ItemDetail;
