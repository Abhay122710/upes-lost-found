import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import upesLogo from '@/assets/upes-logo.jpeg';

const Login = () => {
  const [sapId, setSapId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Admin hardcoded login
    if (sapId === 'admin' && password === 'admin123') {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@upes.ac.in',
        password: 'admin123',
      });
      if (error) {
        // If admin doesn't exist yet, create it
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
          // Create admin profile and role
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
      return;
    }

    // Regular student login: use SAP ID as email prefix
    const email = `${sapId.toLowerCase()}@student.upes.ac.in`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error('Invalid SAP ID or password');
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
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
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in with your SAP ID</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="sapId">SAP ID</Label>
            <Input id="sapId" placeholder="Enter your SAP ID or 'admin'" value={sapId} onChange={e => setSapId(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <div className="text-center space-y-2 text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline block">Forgot Password?</Link>
            <p className="text-muted-foreground">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
