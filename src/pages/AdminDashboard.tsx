import { useEffect, useState } from 'react';
import { Package, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { statsService, type AdminStats } from '@/services/statsService';

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({ total: 0, lost: 0, found: 0, pendingClaims: 0 });

  useEffect(() => {
    const fetch = async () => {
      const data = await statsService.getAdminStats();
      setStats(data);
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
