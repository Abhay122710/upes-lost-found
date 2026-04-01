import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const AdminClaims = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    const { data: claimsData } = await supabase
      .from('claims')
      .select('*, items(title, image_url, location)')
      .order('created_at', { ascending: false });

    if (claimsData && claimsData.length > 0) {
      // Fetch profiles for claim users
      const userIds = [...new Set(claimsData.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name, sap_id')
        .in('user_id', userIds);

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      setClaims(claimsData.map(c => ({ ...c, profile: profileMap.get(c.user_id) || null })));
    } else {
      setClaims([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchClaims(); }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected', itemId?: string) => {
    const { error } = await supabase.from('claims').update({ status }).eq('id', id);
    if (error) { toast.error('Failed to update'); return; }
    if (status === 'approved' && itemId) {
      await supabase.from('items').update({ status: 'claimed' }).eq('id', itemId);
    }
    toast.success(`Claim ${status}`);
    fetchClaims();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Claims Management</h1>
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : claims.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No claims yet.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim, i) => (
            <motion.div
              key={claim.id}
              className="bg-card rounded-2xl p-6 border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {claim.items?.image_url ? (
                    <img src={claim.items.image_url} alt="" className="w-20 h-20 rounded-xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-3xl">📦</div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{claim.items?.title || 'Item'}</h3>
                    <p className="text-sm text-muted-foreground">Claimed by: {claim.profile?.name || 'Unknown'} ({claim.profile?.sap_id || 'N/A'})</p>
                    <p className="text-sm text-muted-foreground mt-1">{claim.description}</p>
                    {claim.proof_image_url && (
                      <a href={claim.proof_image_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> View proof image
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {claim.status === 'pending' ? (
                    <>
                      <Button size="sm" onClick={() => updateStatus(claim.id, 'approved', claim.item_id)} className="bg-secondary text-secondary-foreground gap-1">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(claim.id, 'rejected')} className="gap-1">
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  ) : (
                    <span className={`flex items-center gap-1 text-sm font-medium capitalize ${
                      claim.status === 'approved' ? 'text-secondary' : 'text-destructive'
                    }`}>
                      {claim.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {claim.status}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminClaims;
