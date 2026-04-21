import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass, Home, Workflow, Brain, Bell, User, Zap, ArrowRight, Check } from "lucide-react";
import { getUserId, getUser, type UserProfile } from "@/lib/api";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Workflow, label: "My Workflows", path: "/workflows" },
  { icon: Brain, label: "My Patterns", path: "/patterns" },
  { icon: Bell, label: "Nudges", path: "/nudges" },
  { icon: User, label: "Profile", path: "/profile" },
];

const Nudges = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const userId = getUserId();

  useEffect(() => {
    if (!userId) { navigate("/onboarding"); return; }
    getUser(userId).then((u) => {
      setUser(u);
      // Pre-populate dismissed from seen nudges
      const seenIds = new Set<string>(
        (u?.nudges || [])
          .filter((n: any) => n.seen)
          .map((n: any) => n.id || n.message)
      );
      setDismissed(seenIds);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [userId, navigate]);

  const nudges = (user?.nudges || []) as any[];

  const dismiss = async (nudge: any) => {
    const nudgeKey = nudge.id || nudge.message;
    
    // Optimistic UI update
    setDismissed((prev) => new Set(prev).add(nudgeKey));

    // Persist to backend
    if (userId && nudge.id) {
      try {
        await fetch(
          `https://wayfinder-backend-au9t.onrender.com/users/${userId}/nudges/${nudge.id}/dismiss`,
          { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('Failed to persist nudge dismiss:', err);
      }
    }
  };

  const handleTryIt = (nudge: any) => {
    // Navigate to dashboard with nudge action as prefill
    const action = nudge.action_prompt || nudge.message || "";
    navigate("/dashboard", { state: { prefillQuery: action } });
  };

  // Only show non-dismissed nudges (or all with dismissed ones greyed)
  const visibleNudges = nudges.filter((n: any) => !dismissed.has(n.id || n.message));
  const dismissedNudges = nudges.filter((n: any) => dismissed.has(n.id || n.message));

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/50 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Wayfinder</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${item.path === "/nudges" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-bold">Wayfinder</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">{user?.ai_fitness_level || "—"}</span>
            <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{user?.full_name || user?.name || "User"}</Link>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Nudges</h1>
            <p className="text-muted-foreground mb-8">Personalized suggestions to level up your AI skills.</p>

            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
            ) : nudges.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm mb-1">No nudges yet.</p>
                <p className="text-xs">Complete some sessions and we'll generate personalized tips for you.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Active nudges */}
                {visibleNudges.map((nudge: any, i: number) => (
                  <div key={nudge.id || i} className="rounded-xl bg-card border border-primary/20 hover:border-primary/40 p-5 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {nudge.nudge_type && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {nudge.nudge_type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{nudge.message}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleTryIt(nudge)}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Try it now <ArrowRight className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => dismiss(nudge)}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Dismissed nudges — collapsed at bottom */}
                {dismissedNudges.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs text-muted-foreground mb-3">Dismissed ({dismissedNudges.length})</p>
                    {dismissedNudges.map((nudge: any, i: number) => (
                      <div key={nudge.id || i} className="rounded-xl bg-card border border-border/30 opacity-40 p-4 mb-2">
                        <div className="flex items-start gap-4">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">{nudge.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nudges;