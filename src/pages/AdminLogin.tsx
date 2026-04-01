import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import upesLogo from '@/assets/upes-logo.jpeg';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (username !== 'admin' || password !== 'admin123') {
      toast.error('Invalid admin credentials');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@upes.ac.in',
      password: 'admin123',
    });

    if (error) {
      // Admin account doesn't exist yet — create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@upes.ac.in',
        password: 'admin123',
      });
      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }
      if (signUpData.user) {
        await supabase.from('profiles').insert({
          user_id: signUpData.user.id,
          name: 'Admin',
          sap_id: 'ADMIN001',
          email: 'admin@upes.ac.in',
          security_question: 'Admin account',
          security_answer: 'admin',
        });
        await supabase.from('user_roles').insert({
          user_id: signUpData.user.id,
          role: 'admin',
        });
      }
    }

    toast.success('Welcome, Admin!');
    navigate('/admin');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src={upesLogo} alt="UPES" className="h-12 w-12 rounded-xl object-contain" />
            <span className="text-2xl font-bold text-foreground">UPES Lost & Found</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          </div>
          <p className="text-muted-foreground text-sm">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Admin Username</Label>
            <Input id="username" placeholder="Enter admin username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Admin Password</Label>
            <Input id="password" type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </Button>

          <div className="text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">← Back to Student Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
