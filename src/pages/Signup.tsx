import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import upesLogo from '@/assets/upes-logo.jpeg';

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite book?",
  "What was your childhood nickname?",
];

const Signup = () => {
  const [name, setName] = useState('');
  const [sapId, setSapId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityQuestion) {
      toast.error('Please select a security question');
      return;
    }
    setLoading(true);

    const authEmail = `${sapId.toLowerCase()}@student.upes.ac.in`;

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: data.user.id,
        name,
        sap_id: sapId,
        email,
        security_question: securityQuestion,
        security_answer: securityAnswer.toLowerCase().trim(),
      });

      if (profileError) {
        toast.error('Failed to create profile: ' + profileError.message);
        setLoading(false);
        return;
      }

      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: 'student',
      });

      toast.success('Account created! Welcome to UPES Lost & Found.');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src={upesLogo} alt="UPES" className="h-12 w-12 rounded-xl object-contain" />
            <span className="text-2xl font-bold text-foreground">UPES Lost & Found</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Register with your UPES SAP ID</p>
        </div>

        <form onSubmit={handleSignup} className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>SAP ID</Label>
            <Input placeholder="e.g., 500012345" value={sapId} onChange={e => setSapId(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Personal Email</Label>
            <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label>Security Question</Label>
            <Select value={securityQuestion} onValueChange={setSecurityQuestion}>
              <SelectTrigger><SelectValue placeholder="Select a question" /></SelectTrigger>
              <SelectContent>
                {SECURITY_QUESTIONS.map(q => (
                  <SelectItem key={q} value={q}>{q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Security Answer</Label>
            <Input placeholder="Your answer" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
