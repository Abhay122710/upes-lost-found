import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { claimService, type Claim } from '@/services/claimService';

const MyClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      if (!user) return;
      const data = await claimService.getClaimsByUser(user.id);
      setClaims(data);
      setLoading(false);
    };
    fetchClaims();
  }, [user]);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-accent" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-secondary" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">My Claims</h1>
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : claims.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No claims yet.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim, i) => (
            <motion.div
              key={claim.id}
              className="bg-card rounded-2xl p-5 border border-border/50 flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {claim.items?.image_url ? (
                <img src={claim.items.image_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl">📦</div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{claim.items?.title || 'Item'}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{claim.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {statusIcon(claim.status)}
                <span className={`text-sm font-medium capitalize ${
                  claim.status === 'approved' ? 'text-secondary' : claim.status === 'rejected' ? 'text-destructive' : 'text-accent-foreground'
                }`}>{claim.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
