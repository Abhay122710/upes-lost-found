import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Search, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ lost: 0, found: 0, claims: 0, resolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [lost, found, claims, resolved] = await Promise.all([
        supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'lost'),
        supabase.from('items').select('id', { count: 'exact', head: true }).eq('type', 'found'),
        supabase.from('claims').select('id', { count: 'exact', head: true }).eq('user_id', user?.id || ''),
        supabase.from('items').select('id', { count: 'exact', head: true }).eq('status', 'resolved'),
      ]);
      setStats({
        lost: lost.count || 0,
        found: found.count || 0,
        claims: claims.count || 0,
        resolved: resolved.count || 0,
      });
    };
    fetchStats();
  }, [user]);

  const cards = [
    { icon: Package, label: 'Lost Items', value: stats.lost, color: 'text-destructive' },
    { icon: Search, label: 'Found Items', value: stats.found, color: 'text-secondary' },
    { icon: Shield, label: 'My Claims', value: stats.claims, color: 'text-primary' },
    { icon: TrendingUp, label: 'Resolved', value: stats.resolved, color: 'text-accent' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-card rounded-2xl p-6 border border-border/50 hover-lift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
