import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, ArrowRight, Zap, Target, TrendingUp, Users, Briefcase, GraduationCap, Store, Star, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { sendMagicLink, setPendingEmail } from "@/lib/api";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await sendMagicLink(email.trim());
      setPendingEmail(email.trim());
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Wayfinder</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(217_91%_60%/0.08),transparent_70%)]" />
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-8 animate-fade-up">
            <Zap className="h-3.5 w-3.5" />
            AI-powered guidance for everyone
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Your personal{" "}
            <span className="gradient-text">AI navigator</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Stop guessing which AI tools to use. Wayfinder maps your exact path — from idea to execution — with the right tools, prompts, and workflows.
          </p>

          {/* Magic Link Entry */}
          <div className="animate-fade-up max-w-md mx-auto" style={{ animationDelay: "0.3s" }}>
            {sent ? (
              <div className="rounded-2xl bg-card border border-primary/30 p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Check your email</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  We sent a magic link to <span className="text-foreground font-medium">{email}</span>. Click it to continue.
                </p>
                <p className="text-xs text-muted-foreground/70">No password needed. Ever.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-border/50 p-6 space-y-4">
                <p className="text-sm text-muted-foreground">Enter your email to get started</p>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 h-12"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button variant="glow" className="w-full rounded-xl h-12 text-base" type="submit" disabled={loading || !email.trim()}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <>Continue with Email <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
                <p className="text-xs text-muted-foreground/70 text-center">No password needed. Ever.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everyone knows they should use AI.{" "}
            <span className="text-muted-foreground">Almost nobody knows how.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            There are hundreds of AI tools. Thousands of tutorials. But no clear path from where you are to where you want to be. Wayfinder changes that.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, step: "01", title: "Tell us what you want", desc: "Describe your goal in plain English. No technical knowledge needed." },
              { icon: Compass, step: "02", title: "Get your exact path", desc: "We map the perfect workflow — tools, prompts, and steps — tailored to you." },
              { icon: TrendingUp, step: "03", title: "Build the habit", desc: "Track your progress, get nudges, and level up your AI fitness over time." },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group">
                <div className="text-xs font-mono text-primary/60 mb-4">{item.step}</div>
                <item.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Built for people who get things done</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, title: "Professionals", desc: "Automate workflows and stay ahead" },
              { icon: Users, title: "Freelancers", desc: "Do more with fewer tools" },
              { icon: Store, title: "SMB Owners", desc: "Scale without scaling your team" },
              { icon: GraduationCap, title: "Students", desc: "Learn and research 10x faster" },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-card border border-border/50 text-center hover:border-primary/30 transition-colors">
                <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What early users say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah K.", role: "Marketing Manager", quote: "Wayfinder turned my vague idea into a complete AI workflow in 5 minutes." },
              { name: "James R.", role: "Freelance Designer", quote: "I finally know which AI tools actually matter for my work. Game changer." },
              { name: "Priya M.", role: "MBA Student", quote: "My research process is 10x faster now. I wish I had this sooner." },
            ].map((t) => (
              <div key={t.name} className="p-6 rounded-xl bg-card border border-border/50">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 mb-4">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-semibold">Wayfinder</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 Wayfinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
