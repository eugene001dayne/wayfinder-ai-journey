import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, ArrowRight, Zap, Target, TrendingUp, Users, Briefcase, GraduationCap, Store, Mail, Loader2, CheckCircle2, Shield, Layers } from "lucide-react";
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-8">
            <Zap className="h-3.5 w-3.5" />
            Your personal AI navigator
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Stop guessing.{" "}
            <span className="gradient-text">Start doing.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Tell Wayfinder what you want to get done. Get the exact tools, prompts, and steps to do it — built around your skill level, your constraints, and what actually works.
          </p>

          {/* Magic Link Entry */}
          <div className="max-w-md mx-auto">
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
                <p className="text-sm text-muted-foreground">Enter your email to get started — free, no password</p>
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
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button variant="glow" className="w-full rounded-xl h-12 text-base" type="submit" disabled={loading || !email.trim()}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <>Find My Path <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everyone knows they should use AI.{" "}
            <span className="text-muted-foreground">Almost nobody knows how.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            New tools drop every week. Tutorials are generic. And most people are stuck between "I should be using AI" and actually using it. Wayfinder closes that gap.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { problem: "Too many tools", solution: "We tell you exactly which one to use for your specific task" },
              { problem: "Generic advice", solution: "Every workflow is built around your role, skill level and constraints" },
              { problem: "No follow-through", solution: "We track your patterns and nudge you toward real AI habits" },
            ].map((item) => (
              <div key={item.problem} className="p-5 rounded-xl bg-card border border-border/50">
                <p className="text-sm text-destructive/70 font-medium mb-2">✗ {item.problem}</p>
                <p className="text-sm text-foreground/80">✓ {item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, step: "01", title: "Tell us what you want", desc: "Describe your goal in plain English. We ask a few quick questions to understand your situation." },
              { icon: Compass, step: "02", title: "Get your exact path", desc: "We generate a step-by-step workflow with the right tools, exact prompts to use, and fallbacks if you get stuck." },
              { icon: TrendingUp, step: "03", title: "Build the habit", desc: "Wayfinder learns your patterns, surfaces what you're missing, and nudges you toward better AI habits over time." },
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

      {/* What you get */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What a workflow looks like</h2>
          <p className="text-muted-foreground text-center mb-16">Not vague advice. A real, specific, executable plan.</p>
          <div className="rounded-2xl bg-card border border-primary/20 p-8">
            <div className="mb-6">
              <span className="text-xs text-primary font-medium">Example: "I want to write a weekly newsletter for my clients"</span>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Set up your content feed", tool: "Feedly (free)", time: "10 min", desc: "Add 5 sources covering your industry. Spend 5 minutes each Monday scanning for one interesting story." },
                { step: "2", title: "Generate your draft", tool: "Claude", time: "10 min", desc: "Paste the story + your take. Claude writes a 500-word newsletter in your voice using a prompt we give you." },
                { step: "3", title: "Send it", tool: "Buttondown (free)", time: "5 min", desc: "Paste, preview, send. Your newsletter is live." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border/30">
                  <div className="h-7 w-7 rounded-lg gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-primary">{item.tool}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border/30 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total time: ~25 minutes</span>
              <span className="text-sm text-primary font-medium">All free tools ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Built for people who get things done</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, title: "Professionals", desc: "HR, marketing, ops — automate the repetitive, focus on the strategic" },
              { icon: Users, title: "Freelancers", desc: "Deliver better work faster without hiring or paying for more tools" },
              { icon: Store, title: "SMB Owners", desc: "Scale your output without scaling your team or your costs" },
              { icon: GraduationCap, title: "Students", desc: "Research, write, and learn faster with AI that actually helps" },
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

      {/* Trust */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-3xl">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Shield, title: "No fluff", desc: "Every workflow is specific, actionable, and built for your exact situation" },
              { icon: Layers, title: "No lock-in", desc: "We recommend the best tool for each job — not just one platform" },
              { icon: Zap, title: "No courses", desc: "You learn by doing, not watching. Real tasks, real results, real habits" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-card border border-border/50">
                <item.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-lg text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your path?</h2>
          <p className="text-muted-foreground mb-10">Free to start. No password. No credit card.</p>
          {!sent ? (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border/50 h-12"
                required
              />
              <Button variant="glow" className="rounded-xl h-12 shrink-0" type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">Check your email for your magic link</span>
            </div>
          )}
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