import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft, TrendingUp, Brain, Bell, Clock, User, Mail, Briefcase, MapPin, Zap } from "lucide-react";

const patterns = [
  { title: "Strong at content creation tasks", desc: "You consistently use AI for writing and editing" },
  { title: "Prefers step-by-step guidance", desc: "You engage more with detailed workflows" },
  { title: "Growing automation skills", desc: "You've started connecting multiple tools together" },
];

const nudges = [
  { text: "Try using AI for data analysis — it's a natural next step from your reporting workflows", urgent: true },
  { text: "Explore image generation tools to complement your content creation", urgent: false },
  { text: "Set up a weekly AI learning block — even 15 minutes helps", urgent: false },
];

const sessions = [
  { title: "Automate weekly client reports", date: "Mar 28", rating: 5 },
  { title: "Create social media calendar", date: "Mar 26", rating: 4 },
  { title: "Summarize competitor research", date: "Mar 24", rating: 5 },
  { title: "Build email outreach sequence", date: "Mar 22", rating: 3 },
  { title: "Generate blog post ideas", date: "Mar 20", rating: 4 },
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border/50 flex items-center px-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 mx-auto">
          <Compass className="h-5 w-5 text-primary" />
          <span className="font-bold">Wayfinder</span>
        </div>
        <div className="w-24" />
      </header>

      <div className="max-w-4xl mx-auto p-6 lg:p-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* User card */}
            <div className="rounded-xl bg-card border border-border/50 p-6 text-center">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-bold mb-1">Alex Martinez</h2>
              <p className="text-sm text-muted-foreground mb-4">Marketing Manager</p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" /> alex@company.com
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="h-3 w-3" /> Marketing & Advertising
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Joined Mar 2026
                </div>
              </div>
            </div>

            {/* AI Fitness */}
            <div className="rounded-xl bg-card border border-border/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">AI Fitness Level</h3>
              </div>
              <div className="text-center mb-4">
                <div className="relative w-28 h-28 mx-auto">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(240 10% 14%)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#gradient)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${42 * 2 * Math.PI}`}
                      strokeDashoffset={`${42 * 2 * Math.PI * (1 - 0.42)}`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                        <stop offset="100%" stopColor="hsl(263 70% 52%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-2xl font-bold gradient-text">42</div>
                      <div className="text-[10px] text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">Beginner</span>
                <p className="text-xs text-muted-foreground mt-3">Focus: Prompt engineering basics</p>
              </div>
            </div>
          </div>

          {/* Right columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patterns */}
            <div className="rounded-xl bg-card border border-border/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Patterns Detected</h3>
              </div>
              <div className="space-y-3">
                {patterns.map((p) => (
                  <div key={p.title} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <h4 className="text-sm font-medium mb-1">{p.title}</h4>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nudges */}
            <div className="rounded-xl bg-card border border-border/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Pending Nudges</h3>
              </div>
              <div className="space-y-3">
                {nudges.map((n, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${n.urgent ? "border-primary/30 bg-primary/5" : "border-border/30 bg-muted/30"}`}>
                    <div className="flex items-start gap-3">
                      <Zap className={`h-4 w-4 mt-0.5 shrink-0 ${n.urgent ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="text-sm text-foreground/80">{n.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session history */}
            <div className="rounded-xl bg-card border border-border/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Session History</h3>
              </div>
              <div className="space-y-2">
                {sessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-xs ${star <= s.rating ? "text-primary" : "text-muted-foreground/20"}`}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
