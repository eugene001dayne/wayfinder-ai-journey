import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass, ArrowLeft, TrendingUp, Brain, Bell, Clock, User, Mail, Briefcase, Zap } from "lucide-react";
import { getUserId, getUser, type UserProfile as UserProfileType, type Pattern, type Nudge } from "@/lib/api";

interface WorkflowRecord {
  id: string;
  session_id: string;
  title: string;
  created_at: string;
  outcome_rating?: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    if (!userId) { navigate("/onboarding"); return; }

    Promise.allSettled([
      getUser(userId),
      // Fetch workflows directly — they have real titles and dates
      fetch(`https://wayfinder-backend-au9t.onrender.com/workflows?user_id=${userId}`)
        .then(r => r.ok ? r.json() : [])
        .catch(() => [])
    ]).then(([uRes, wRes]) => {
      if (uRes.status === "fulfilled") setUser(uRes.value);
      if (wRes.status === "fulfilled") {
        const w = wRes.value as any;
        setWorkflows(Array.isArray(w) ? w : (w.workflows || []));
      }
      setLoading(false);
    });
  }, [userId, navigate]);

  const score = user?.ai_fitness_score ?? 0;
  const level = user?.ai_fitness_level ?? "Beginner";
  const patterns = (user?.patterns || []) as Pattern[];
  const nudges = (user?.nudges || []) as Nudge[];

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
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-6"><Skeleton className="h-64 rounded-xl" /><Skeleton className="h-56 rounded-xl" /></div>
            <div className="lg:col-span-2 space-y-6"><Skeleton className="h-48 rounded-xl" /><Skeleton className="h-48 rounded-xl" /><Skeleton className="h-48 rounded-xl" /></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Identity card */}
              <div className="rounded-xl bg-card border border-border/50 p-6 text-center">
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-bold mb-1">{user?.full_name || user?.name || "User"}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user?.role || ""}</p>
                <div className="space-y-2 text-left">
                  {user?.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" /> {user.email}
                    </div>
                  )}
                  {user?.industry && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" /> {user.industry}
                    </div>
                  )}
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
                      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${42 * 2 * Math.PI}`}
                        strokeDashoffset={`${42 * 2 * Math.PI * (1 - score / 100)}`} />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                          <stop offset="100%" stopColor="hsl(263 70% 52%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-2xl font-bold gradient-text">{score}</div>
                        <div className="text-[10px] text-muted-foreground">/ 100</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">{level}</span>
                  <p className="text-xs text-muted-foreground mt-3">Focus: {user?.ai_fitness_focus || "Getting started"}</p>
                </div>
                {/* Fitness level explanation */}
                <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                  {[
                    { label: "Beginner", sub: "Microtasker", range: "0–33", active: score < 34 },
                    { label: "Intermediate", sub: "Copilot", range: "34–66", active: score >= 34 && score < 67 },
                    { label: "Advanced", sub: "Delegate", range: "67–100", active: score >= 67 },
                  ].map((tier) => (
                    <div key={tier.label} className={`flex items-center justify-between text-xs px-2 py-1.5 rounded-lg ${tier.active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                      <span className="font-medium">{tier.label} <span className="font-normal opacity-70">— {tier.sub}</span></span>
                      <span>{tier.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patterns */}
              <div className="rounded-xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Patterns Detected</h3>
                </div>
                {patterns.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No patterns detected yet. Complete 3+ sessions to unlock insights.</p>
                ) : (
                  <div className="space-y-3">
                    {patterns.map((p, i) => (
                      <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                        <h4 className="text-sm font-medium mb-1">{p.description}</h4>
                        {p.suggested_fix && (
                          <p className="text-xs text-muted-foreground">{p.suggested_fix}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nudges */}
              <div className="rounded-xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Pending Nudges</h3>
                </div>
                {nudges.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No nudges yet.</p>
                ) : (
                  <div className="space-y-3">
                    {nudges.map((n, i) => (
                      <div key={i} className="p-4 rounded-lg border border-border/30 bg-muted/30">
                        <div className="flex items-start gap-3">
                          <Zap className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                          <p className="text-sm text-foreground/80">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Session/Workflow History — now fetched from workflows table */}
              <div className="rounded-xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Workflow History</h3>
                </div>
                {workflows.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No workflows yet.</p>
                ) : (
                  <div className="space-y-2">
                    {workflows.map((wf, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{wf.title || "Untitled Workflow"}</p>
                          <p className="text-xs text-muted-foreground">
                            {wf.created_at
                              ? new Date(wf.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                              : ""}
                          </p>
                        </div>
                        {wf.outcome_rating != null && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`text-xs ${star <= (wf.outcome_rating || 0) ? "text-primary" : "text-muted-foreground/20"}`}>★</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
