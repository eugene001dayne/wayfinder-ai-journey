import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Target, TrendingUp, Users, Briefcase, GraduationCap, Store, Mail, Loader2, CheckCircle2, Shield, Layers } from "lucide-react";
import { sendMagicLink, setPendingEmail, getUserId } from "@/lib/api";

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, skip landing and go straight to dashboard
  useEffect(() => {
    const userId = getUserId();
    if (userId) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await sendMagicLink(email.trim());
      setPendingEmail(email.trim());
      setSent(true);
      (window as any).pendo?.track("magic_link_requested", {
        email_domain: email.trim().split("@")[1] || "",
        form_location: "landing_page",
        is_returning_user: !!getUserId(),
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-white/90 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            {/* Your PNG logo */}
            <img src="/icon-192.png" alt="Wayfinder" width={28} height={28} className="rounded-lg" />
            <span className="text-base font-bold text-foreground">Wayfinder</span>
          </div>
          <button
            onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm text-primary font-medium hover:underline"
          >
            Get started free →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(217_91%_60%/0.06),transparent_70%)]" />
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-8">
            <Zap className="h-3 w-3" />
            Your personal AI navigator
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-foreground">
            Stop guessing.{" "}
            <span className="gradient-text">Start doing.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Tell Wayfinder what you want to get done. Get the exact tools, prompts, and steps — built around your skill level, your constraints, and what actually works.
          </p>

          {/* Magic Link Entry */}
          <div id="get-started" className="max-w-md mx-auto">
            {sent ? (
              <div className="rounded-2xl bg-white border border-primary/20 p-8 text-center card-shadow">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
                <h2 className="text-lg font-bold mb-2">Check your email</h2>
                <p className="text-muted-foreground text-sm mb-3">
                  We sent a magic link to <span className="text-foreground font-medium">{email}</span>.
                </p>
                <p className="text-xs text-muted-foreground">Click the link in your email to continue. No password needed.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-border p-5 space-y-3 card-shadow">
                <p className="text-sm text-muted-foreground">Enter your email to get started — free, no password</p>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/40 border-border h-11"
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  className="w-full rounded-xl h-11 gradient-bg text-white border-0"
                  type="submit"
                  disabled={loading || !email.trim()}
                >
                  {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    : <>Find My Path <ArrowRight className="ml-2 h-4 w-4" /></>
                  }
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Everyone knows they should use AI.{" "}
            <span className="text-muted-foreground font-normal">Almost nobody knows how.</span>
          </h2>
          <p className="text-muted-foreground mb-10">
            New tools drop every week. Tutorials are generic. Wayfinder closes the gap.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { problem: "Too many tools", solution: "We tell you exactly which one to use for your task" },
              { problem: "Generic advice", solution: "Every workflow is built around your role and constraints" },
              { problem: "No follow-through", solution: "We track patterns and nudge you toward real AI habits" },
            ].map((item) => (
              <div key={item.problem} className="p-4 rounded-xl bg-white border border-border card-shadow">
                <p className="text-xs text-red-500 font-medium mb-1.5">✗ {item.problem}</p>
                <p className="text-sm text-foreground/80">✓ {item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, step: "01", title: "Tell us what you want", desc: "Describe your goal. We ask a few quick questions about your situation and tools." },
              { icon: ArrowRight, step: "02", title: "Get your exact path", desc: "A step-by-step workflow with the right tools, exact prompts, and fallbacks if you get stuck." },
              { icon: TrendingUp, step: "03", title: "Build the habit", desc: "Wayfinder learns your patterns and nudges you toward better AI habits over time." },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-xl bg-white border border-border card-shadow hover:border-primary/30 transition-colors">
                <div className="text-xs font-mono text-primary/50 mb-3">{item.step}</div>
                <item.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example workflow */}
      <section className="py-16 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">What a workflow looks like</h2>
          <p className="text-muted-foreground text-center text-sm mb-10">Not vague advice. A real, specific, executable plan.</p>
          <div className="rounded-xl bg-white border border-primary/20 p-6 card-shadow">
            <p className="text-xs text-primary font-medium mb-5">Example: "I want to write a weekly newsletter for my clients"</p>
            <div className="space-y-3">
              {[
                { step: "1", title: "Set up your content feed", tool: "Feedly (free)", time: "10 min", desc: "Add 5 sources. Scan for one story every Monday morning." },
                { step: "2", title: "Generate your draft", tool: "Claude", time: "10 min", desc: "Paste the story + your take. Claude writes 500 words in your voice using a prompt we give you." },
                { step: "3", title: "Send it", tool: "Buttondown (free)", time: "5 min", desc: "Paste, preview, send. Newsletter live." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 p-3.5 rounded-lg bg-muted/40 border border-border/50">
                  <div className="h-6 w-6 rounded-md gradient-bg flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-primary">{item.tool}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total: ~25 minutes</span>
              <span className="text-xs text-primary font-medium">All free tools ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Built for people who get things done</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Briefcase, title: "Professionals", desc: "Automate the repetitive, focus on the strategic" },
              { icon: Users, title: "Freelancers", desc: "Deliver better work faster, without more tools" },
              { icon: Store, title: "SMB Owners", desc: "Scale your output without scaling your costs" },
              { icon: GraduationCap, title: "Students", desc: "Research, write, and learn smarter with AI" },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-white border border-border card-shadow text-center hover:border-primary/30 transition-colors">
                <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-16 px-4 border-t border-border bg-muted/20">
        <div className="container mx-auto max-w-3xl">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            {[
              { icon: Shield, title: "No fluff", desc: "Every workflow is specific and actionable" },
              { icon: Layers, title: "No lock-in", desc: "We recommend the best tool — not one platform" },
              { icon: Zap, title: "No courses", desc: "You learn by doing. Real tasks, real results" },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-white border border-border card-shadow">
                <item.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to find your path?</h2>
          <p className="text-muted-foreground text-sm mb-8">Free to start. No password. No credit card.</p>
          {!sent ? (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-border h-11 flex-1"
                required
              />
              <Button
                className="gradient-bg text-white border-0 rounded-xl h-11 px-4 shrink-0"
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Check your email for your magic link</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/icon-192.png" alt="Wayfinder" width={22} height={22} className="rounded-md" />
            <span className="text-sm font-semibold text-foreground">Wayfinder</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="mailto:www.bitelance.team@gmail.com?subject=Wayfinder Feedback" className="hover:text-primary transition-colors">
              Share feedback
            </a>
            <a href="mailto:www.bitelance.team@gmail.com?subject=Question" className="hover:text-primary transition-colors">
              Contact us
            </a>
            <span>© 2026 Wayfinder</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
