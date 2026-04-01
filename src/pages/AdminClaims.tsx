import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { claimService, type Claim } from '@/services/claimService';

const AdminClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await claimService.getAllClaims();
      setClaims(data);
    } catch {
      toast.error('Failed to load claims');
    }
    setLoading(false);
  };

  useEffect(() => { fetchClaims(); }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected', itemId?: string) => {
    try {
      await claimService.updateClaimStatus(id, status, itemId);
      toast.success(`Claim ${status}`);
      fetchClaims();
    } catch {
      toast.error('Failed to update');
    }
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
