import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, registerWithEmail, loginWithGoogle } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        toast({ title: 'Welcome back', description: 'Signed in successfully.' });
      } else {
        await registerWithEmail(email, password, displayName || email.split('@')[0]);
        toast({ title: 'Account created', description: 'Welcome to DiceyTech!' });
      }
      navigate('/dashboard');
    } catch (error: any) {
      const message = error?.code === 'auth/user-not-found'
        ? 'No account found. Please sign up.'
        : error?.code === 'auth/wrong-password'
        ? 'Incorrect password.'
        : error?.message || 'Authentication failed.';
      toast({ title: 'Auth error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (e) {
      toast({ title: 'Google sign-in failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to DiceyTech</CardTitle>
          <CardDescription>{mode === 'signin' ? 'Sign in to access hackathons' : 'Create an account to get started'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button variant={mode === 'signin' ? 'default' : 'outline'} onClick={() => setMode('signin')}>Sign In</Button>
            <Button variant={mode === 'signup' ? 'default' : 'outline'} onClick={() => setMode('signup')}>Sign Up</Button>
          </div>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Input placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>
            )}
            <div className="space-y-2">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          <div className="relative my-4 text-center text-sm text-muted-foreground">or</div>
          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
