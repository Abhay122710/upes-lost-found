import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import upesLogo from '@/assets/upes-logo.jpeg';

const ForgotPassword = () => {
  const [sapId, setSapId] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('sap_id', sapId)
      .single();

    if (error || !data) {
      toast.error('SAP ID not found');
      setLoading(false);
      return;
    }

    if (data.security_answer !== securityAnswer.toLowerCase().trim()) {
      toast.error('Incorrect security answer');
      setLoading(false);
      return;
    }

    setProfile(data);
    setStep('reset');
    toast.success('Identity verified! Set your new password.');
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Sign in as the user first then update password
    const email = `${sapId.toLowerCase()}@student.upes.ac.in`;
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      // If not logged in, we need a workaround - sign in with admin and reset
      toast.error('Please contact admin to reset your password, or try logging in with the new password after some time.');
    } else {
      toast.success('Password updated successfully!');
      navigate('/login');
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
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground text-sm mt-1">Verify your identity using security question</p>
        </div>

        {step === 'verify' ? (
          <form onSubmit={handleVerify} className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 space-y-5">
            <div className="space-y-2">
              <Label>SAP ID</Label>
              <Input placeholder="Enter your SAP ID" value={sapId} onChange={e => setSapId(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Security Answer</Label>
              <Input placeholder="Answer to your security question" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required />
              {profile && <p className="text-xs text-muted-foreground">{profile.security_question}</p>}
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Identity'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleReset} className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 space-y-5">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="Min 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
