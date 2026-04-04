import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, ArrowLeft, Loader2, Mail } from "lucide-react";
import { getUserByEmail, setUserId } from "@/lib/api";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      const user = await getUserByEmail(email.trim());
      setUserId(user.id);
      navigate("/dashboard");
    } catch {
      setError("No account found. Please get started instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Compass className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Wayfinder</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in with your email to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-border/50 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}{" "}
              <Link to="/onboarding" className="text-primary hover:underline font-medium">
                Get Started →
              </Link>
            </div>
          )}

          <Button variant="glow" className="w-full rounded-xl" type="submit" disabled={loading || !email.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/onboarding" className="text-primary hover:underline">Get Started</Link>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
