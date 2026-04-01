import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, Shield, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, pendingClaims: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [total, lost, found, pending] = await Promise.all([
        supabase.from('items').select('id', { count: 'exact', head: true }),
        supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'lost'),
        supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'found'),
        supabase.from('claims').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      setStats({ total: total.count || 0, lost: lost.count || 0, found: found.count || 0, pendingClaims: pending.count || 0 });
    };
    fetch();
  }, []);

  const cards = [
    { icon: Package, label: 'Total Items', value: stats.total },
    { icon: Package, label: 'Lost Items', value: stats.lost },
    { icon: Package, label: 'Found Items', value: stats.found },
    { icon: Shield, label: 'Pending Claims', value: stats.pendingClaims },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <motion.div key={c.label} className="bg-card rounded-2xl p-6 border border-border/50 hover-lift" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <c.icon className="w-8 h-8 text-primary mb-3" />
            <p className="text-3xl font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
