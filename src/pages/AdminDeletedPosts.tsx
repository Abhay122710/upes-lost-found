import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Trash2, MapPin, Calendar } from 'lucide-react';

const AdminDeletedPosts = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('deleted_items')
        .select('*')
        .order('deleted_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Deleted Posts</h1>
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No deleted posts yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="bg-card rounded-2xl p-5 border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex gap-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-xl object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-3xl">📦</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      item.type === 'lost' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 flex items-start gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                    <p className="text-xs text-destructive"><span className="font-medium">Reason:</span> {item.deletion_reason}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Deleted on {new Date(item.deleted_at).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDeletedPosts;
